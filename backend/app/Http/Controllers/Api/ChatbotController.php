<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Order;
use App\Models\Favorite;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class ChatbotController extends Controller
{
    public function chat(Request $request): JsonResponse
    {
        $request->validate(['message' => 'required|string|max:500']);
        $msg = strtolower(trim($request->input('message')));
        $user = $request->user();
        $customerId = $user->user_id;

        // 1. Dynamic (database) intents
        $dynamicReply = $this->detectDynamicIntent($msg, $customerId);
        if ($dynamicReply) {
            return response()->json(['reply' => $dynamicReply]);
        }

        // 2. Static (knowledge base) intents
        $staticReply = $this->detectStaticIntent($msg);
        if ($staticReply) {
            return response()->json(['reply' => $staticReply]);
        }

        // 3. Fallback
        return response()->json([
            'reply' => "Hmm, I'm not sure about that. 🤔\n\nTry asking:\n• cart total\n• how many orders\n• products I ordered\n• what is marketlink?\n• sustainability\n• help\n\nOr type 'topics' to see everything I know about.",
        ]);
    }

    // ==================================================================
    // DYNAMIC INTENTS (Database)
    // ==================================================================
    private function detectDynamicIntent(string $msg, int $customerId): ?string
    {
        // Greetings
        if (preg_match('/\b(hi|hello|hey|salam|assalam)\b/', $msg)) {
            return "Hello! 👋 I'm your MarketLink assistant. Ask me about orders, cart, products, sustainability, farmers, delivery, or type 'topics' to see everything!";
        }

        // Cart total
        if (preg_match('/(cart|basket).*(total|price|amount|cost)/', $msg) ||
            preg_match('/(total|how much).*(cart|basket)/', $msg)) {
            $items = DB::table('cart_items')
                ->join('products', 'cart_items.product_id', '=', 'products.product_id')
                ->where('cart_items.customer_id', $customerId)
                ->selectRaw('SUM(cart_items.quantity * products.price) as total, COUNT(*) as count')
                ->first();

            $count = $items->count ?? 0;
            $total = number_format($items->total ?? 0, 2);

            return "🛒 Your cart has {$count} items with a total value of \${$total}.";
        }

        // Total orders
        if (preg_match('/(how many|total|number).*(order)/', $msg)) {
            $total = Order::where('customer_id', $customerId)->count();
            $pending = Order::where('customer_id', $customerId)
                ->whereIn('order_status', ['placed', 'accepted', 'ready_for_pickup'])
                ->count();

            return "📦 You've placed {$total} orders in total. {$pending} of them are currently pending.";
        }

        // Total expenses
        if (preg_match('/(how much|total).*(spent|spend|expense|paid|cost)/', $msg)) {
            $total = Order::where('customer_id', $customerId)
                ->where('order_status', 'completed')
                ->sum('total_amount');
            $total = number_format($total, 2);

            return "💰 You've spent \${$total} so far (completed orders only).";
        }

        // Pending orders
        if (preg_match('/(pending|waiting|in.?progress|active)/', $msg)) {
            $orders = Order::where('customer_id', $customerId)
                ->whereIn('order_status', ['placed', 'accepted', 'ready_for_pickup'])
                ->with('farmer:id,stall_name')
                ->orderByDesc('created_at')
                ->limit(5)
                ->get();

            if ($orders->isEmpty()) {
                return "✅ You have no pending orders. Everything is complete!";
            }

            $list = $orders->map(function ($o) {
                $status = str_replace('_', ' ', $o->order_status);
                return "• Order #{$o->order_id} — {$o->farmer->stall_name} ({$status})";
            })->implode("\n");

            return "⏳ You have {$orders->count()} pending orders:\n{$list}";
        }

        // Cancelled orders
        if (preg_match('/(cancel|refund|returned)/', $msg)) {
            $orders = Order::where('customer_id', $customerId)
                ->where('order_status', 'cancelled')
                ->orderByDesc('created_at')
                ->limit(5)
                ->get();

            if ($orders->isEmpty()) {
                return "🎉 You haven't cancelled any orders. Great job!";
            }

            $list = $orders->map(function ($o) {
                return "• Order #{$o->order_id} — \${$o->total_amount}";
            })->implode("\n");

            return "❌ You've cancelled {$orders->count()} orders:\n{$list}";
        }

        // Completed orders
        if (preg_match('/(completed|complete|delivered|done|finished)/', $msg)) {
            $count = Order::where('customer_id', $customerId)
                ->where('order_status', 'completed')
                ->count();

            return "✅ You've successfully completed {$count} orders.";
        }

        // Top products
        if (preg_match('/(top|favourite|favorite|most|best).*(product|item)/', $msg) ||
            preg_match('/(top products|my products)/', $msg)) {
            $products = DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.order_id')
                ->join('products', 'order_items.product_id', '=', 'products.product_id')
                ->where('orders.customer_id', $customerId)
                ->selectRaw('products.name, SUM(order_items.quantity) as total_qty')
                ->groupBy('products.name')
                ->orderByDesc('total_qty')
                ->limit(3)
                ->get();

            if ($products->isEmpty()) {
                return "You haven't ordered any products yet.";
            }

            $list = $products->map(function ($p) {
                return "• {$p->name} — {$p->total_qty}x ordered";
            })->implode("\n");

            return "⭐ Your top ordered products:\n{$list}";
        }

        // ✅ NAYA: All products ordered (by name)
        if (preg_match('/(products?|items?).*(ordered|order|bought|purchased)/', $msg) ||
            preg_match('/(ordered|bought|purchased).*(products?|items?)/', $msg) ||
            preg_match('/(name of the products|list of products|which products|what products)/', $msg) ||
            preg_match('/(konsy|kaunse|kya).*(product|item)/', $msg) ||
            preg_match('/(product|item).*(kya|konsy|kaunse)/', $msg)) {

            $products = DB::table('order_items')
                ->join('orders', 'order_items.order_id', '=', 'orders.order_id')
                ->join('products', 'order_items.product_id', '=', 'products.product_id')
                ->where('orders.customer_id', $customerId)
                ->selectRaw('products.name, SUM(order_items.quantity) as total_qty')
                ->groupBy('products.name')
                ->orderByDesc('total_qty')
                ->get();

            if ($products->isEmpty()) {
                return "You haven't ordered any products yet.";
            }

            $list = $products->map(function ($p) {
                return "• {$p->name} — {$p->total_qty}x ordered";
            })->implode("\n");

            $count = $products->count();
            return "🛍️ You have ordered {$count} different products:\n{$list}";
        }

        // Favorites
        if (preg_match('/(my favorite|my favourite|my saved|my liked)/', $msg)) {
            $count = Favorite::where('customer_id', $customerId)->count();
            return "❤️ You have {$count} items saved in your favorites.";
        }

        // Recent order
        if (preg_match('/(recent|last|latest).*(order)/', $msg)) {
            $order = Order::where('customer_id', $customerId)
                ->with('farmer:id,stall_name')
                ->orderByDesc('created_at')
                ->first();

            if (!$order) {
                return "You haven't placed any orders yet.";
            }

            $status = str_replace('_', ' ', $order->order_status);
            return "🧾 Your last order:\n• ID: #{$order->order_id}\n• Farmer: {$order->farmer->stall_name}\n• Total: \${$order->total_amount}\n• Status: {$status}";
        }

        return null;
    }

    // ==================================================================
    // STATIC INTENTS
    // ==================================================================
    private function detectStaticIntent(string $msg): ?string
    {
        $knowledgeBase = $this->getKnowledgeBase();

        // Special commands
        if (preg_match('/(help|assist|what can you do|how can you help)/', $msg)) {
            return $this->getHelpText();
        }

        if (preg_match('/(topics|categories|what do you know|list)/', $msg)) {
            return $this->getTopicsText();
        }

        // Smart matching
        $msgWords = preg_split('/\s+/', $msg);
        $msgWords = array_filter($msgWords, fn($w) => strlen($w) >= 3);
        $bestMatch = null;
        $bestScore = 0;

        foreach ($knowledgeBase as $entry) {
            $score = 0;

            foreach ($entry['keywords'] as $keyword) {
                if (str_contains($msg, $keyword)) {
                    $score += 10;
                }

                $keywordWords = preg_split('/\s+/', $keyword);
                foreach ($keywordWords as $kw) {
                    if (strlen($kw) < 3) continue;

                    foreach ($msgWords as $msgWord) {
                        if ($kw === $msgWord) {
                            $score += 5;
                        } elseif (strlen($kw) >= 4 && str_contains($msgWord, $kw)) {
                            $score += 3;
                        } elseif (strlen($msgWord) >= 4 && str_contains($kw, $msgWord)) {
                            $score += 3;
                        }
                    }
                }
            }

            if ($score > $bestScore) {
                $bestScore = $score;
                $bestMatch = $entry['answer'];
            }
        }

        if ($bestScore >= 3 && $bestMatch) {
            return $bestMatch;
        }

        return null;
    }

    // ==================================================================
    // KNOWLEDGE BASE
    // ==================================================================
    private function getKnowledgeBase(): array
    {
        return [
            // ==================== ABOUT MARKETLINK ====================
            ['keywords' => ['what is marketlink', 'about marketlink', 'marketlink kya hai', 'marketlink', 'market link'],
             'answer' => "🌱 MarketLink is a platform that connects local farmers directly with customers. We help you pre-order fresh, seasonal produce from verified local growers and pick it up at your nearest market — no middlemen, no pre-payment required!"],

            ['keywords' => ['why marketlink', 'why use marketlink', 'benefit of marketlink', 'benefits'],
             'answer' => "✨ MarketLink helps you:\n• Get fresher produce directly from farmers\n• Support local growers in your community\n• Pre-order before market day\n• Pay at pickup — no advance payment\n• Know real-time stock availability"],

            ['keywords' => ['how does marketlink work', 'how marketlink works', 'marketlink kaise kaam', 'how it works', 'how does it work'],
             'answer' => "🔧 How MarketLink works:\n1️⃣ Browse nearby farmers and markets\n2️⃣ Add fresh produce to your basket\n3️⃣ Pre-order and choose pickup time\n4️⃣ Collect at the market & pay at stall\n\nSimple, transparent, and farmer-friendly!"],

            ['keywords' => ['who started marketlink', 'who created marketlink', 'founder of marketlink', 'founder', 'owner'],
             'answer' => "MarketLink was built to solve a real problem — customers didn't know what farmers would have at the market. We created a unified platform where farmers publish weekly stock and customers can reserve in advance."],

            ['keywords' => ['marketlink mission', 'our mission', 'goal of marketlink', 'mission', 'goal', 'purpose'],
             'answer' => "🎯 Our mission is to strengthen the connection between local producers and their community by making farmers markets more convenient, predictable, and personal."],

            ['keywords' => ['marketlink vision', 'future of marketlink', 'vision', 'future'],
             'answer' => "🚀 Our vision is to become the #1 platform for local food sourcing — where every community has access to fresh, seasonal, and locally-grown produce."],

            // ==================== SUSTAINABILITY ====================
            ['keywords' => ['sustainability', 'sustainable', 'eco friendly', 'ecofriendly', 'eco-friendly', 'environment', 'environmental', 'green', 'carbon', 'climate', 'planet', 'earth', 'nature'],
             'answer' => "🌍 MarketLink is sustainable & eco-friendly!\n\n• Short-distance transport = lower carbon emissions\n• No plastic packaging waste\n• Supports local economy\n• Seasonal eating = natural & sustainable\n• Reduces food miles\n\nEvery purchase makes a difference for the planet! 💚"],

            ['keywords' => ['plastic', 'plastic free', 'plastic-free', 'packaging', 'waste', 'zero waste', 'recycle', 'recycling'],
             'answer' => "♻️ We encourage plastic-free shopping! Bring your own bags to pickup. Most farmers use paper or reusable packaging. Together we reduce waste!"],

            ['keywords' => ['support local', 'local economy', 'local business', 'buy local', 'local farmers', 'community'],
             'answer' => "💚 When you buy from MarketLink:\n• 100% of money goes to local farmers\n• Strengthens your community\n• Keeps food dollars local\n• Creates rural jobs\n\nEvery purchase makes a difference!"],

            ['keywords' => ['carbon footprint', 'food miles', 'carbon emission', 'co2', 'emissions'],
             'answer' => "🌱 Local food has a much smaller carbon footprint than imported food. Average food travels 1,500 miles to reach your plate. MarketLink produce travels just a few miles!"],

            // ==================== HOW IT WORKS ====================
            ['keywords' => ['how to order', 'how to place order', 'place an order', 'ordering', 'order'],
             'answer' => "📦 To place an order:\n1. Browse products from nearby farmers\n2. Click 'Add to Cart'\n3. Go to cart and click 'Checkout'\n4. Choose pickup date and confirm\n5. Pay at the market when you collect!"],

            ['keywords' => ['pre order', 'pre-order', 'preorder', 'reserve', 'reservation', 'pre booking'],
             'answer' => "🛒 Pre-order means reserving your produce before market day. It guarantees:\n• Your items will be available\n• Farmers harvest to demand\n• You skip long queues\n• Pay at pickup — zero risk!"],

            ['keywords' => ['add to cart', 'add item', 'adding item', 'cart'],
             'answer' => "🛒 To add items:\n1. Browse any product\n2. Click 'Add to Cart'\n3. Choose quantity if needed\n4. View cart to proceed to checkout"],

            ['keywords' => ['remove from cart', 'delete from cart', 'remove item', 'removing', 'delete'],
             'answer' => "🗑️ To remove an item:\n1. Open your cart\n2. Click the trash icon next to the item\n3. It'll be removed instantly"],

            ['keywords' => ['checkout', 'checkout process', 'proceed to checkout'],
             'answer' => "✅ Checkout steps:\n1. Review your cart\n2. Click 'Proceed to Checkout'\n3. Select pickup date & time\n4. Confirm order\n5. Pick up & pay at the stall!"],

            ['keywords' => ['track order', 'tracking', 'order tracking', 'status', 'track'],
             'answer' => "📍 To track orders:\n1. Go to My Orders from dashboard\n2. See status: Placed → Accepted → Ready → Completed\n3. Click 'View Details' for full info"],

            // ==================== PAYMENT ====================
            ['keywords' => ['payment', 'payment method', 'payment methods', 'pay', 'paying'],
             'answer' => "💵 Payment is done at pickup! We don't require pre-payment. You can pay:\n• Cash at the stall\n• Card (if farmer accepts)\n• Digital wallet (case by case)"],

            ['keywords' => ['prepayment', 'pre-payment', 'advance payment', 'prepay', 'advance'],
             'answer' => "💚 Zero pre-payment! MarketLink doesn't ask for advance payment. You pay only when you pick up your order. Total peace of mind!"],

            ['keywords' => ['refund', 'money back', 'refunds', 'return'],
             'answer' => "💸 Since there's no pre-payment, refunds aren't needed. If your order is cancelled, nothing is charged. Simple!"],

            ['keywords' => ['payment security', 'safe payment', 'secure', 'security'],
             'answer' => "🔒 Your payment happens in-person at the market stall. No online payment, no card details stored. 100% safe & transparent."],

            // ==================== DELIVERY & PICKUP ====================
            ['keywords' => ['delivery', 'deliver', 'home delivery', 'shipping', 'ship'],
             'answer' => "🚚 MarketLink is a PICKUP-based platform, not delivery. You order online and pick up at your local market on market day. This keeps prices low and produce fresh!"],

            ['keywords' => ['pickup', 'pick up', 'pick-up', 'collection', 'collect'],
             'answer' => "📍 MarketLink uses a pickup model. You order online and collect at your local market on the scheduled day. This ensures freshness and low prices!"],

            ['keywords' => ['pickup location', 'where to pickup', 'pickup point', 'location'],
             'answer' => "📍 Each product shows its pickup market. Common pickup points:\n• Local farmers markets\n• Community centers\n• Designated market stalls\n\nCheck product page for exact location!"],

            ['keywords' => ['pickup time', 'when pickup', 'pickup schedule', 'timing', 'schedule'],
             'answer' => "⏰ Pickup timing depends on the market. Most markets run:\n• Wednesday: 7 AM – 12 PM\n• Friday: 7 AM – 12 PM\n• Saturday: 7 AM – 1 PM\n• Sunday: 8 AM – 12 PM\n\nExact timing shown at checkout."],

            ['keywords' => ['pickup window', 'pickup slot', 'window', 'slot'],
             'answer' => "🕒 The pickup window is a specific time slot when your order will be ready. Example: 'Wednesday 8 AM – 11 AM'. You can arrive anytime during this window."],

            ['keywords' => ['miss pickup', 'missed pickup', 'miss my pickup'],
             'answer' => "⚠️ If you miss pickup:\n• Contact the farmer ASAP\n• Most will hold for a few hours\n• If not collected, order may be cancelled\n• No charge since it's pay-at-pickup!"],

            ['keywords' => ['change pickup', 'reschedule', 'change time'],
             'answer' => "📅 To change pickup time:\n1. Contact the farmer directly (phone shown on order page)\n2. Or cancel and re-order with new slot\n\nWe recommend contacting the farmer first!"],

            // ==================== ORDERS ====================
            ['keywords' => ['order status', 'status', 'order states', 'order stage'],
             'answer' => "📊 Order statuses:\n• Placed — Order received\n• Accepted — Farmer confirmed\n• Ready for Pickup — Ready to collect\n• Completed — Picked up & paid\n• Cancelled — Cancelled by you or farmer"],

            ['keywords' => ['cancel order', 'cancel', 'cancellation', 'cancelling', 'cancelled'],
             'answer' => "❌ To cancel an order:\n1. Go to My Orders\n2. Open the order details\n3. Click 'Cancel Order' (only if not yet accepted)\n\nOnce farmer accepts, please contact them directly."],

            ['keywords' => ['modify order', 'edit order', 'change order', 'update order'],
             'answer' => "✏️ Orders can't be edited after placing. If you need changes:\n1. Cancel the order (if not accepted)\n2. Place a new one\n\nOr contact the farmer!"],

            ['keywords' => ['minimum order', 'minimum', 'min order'],
             'answer' => "📦 There's no minimum order value! You can order as little as 1 item. This makes it easy to try new things."],

            ['keywords' => ['bulk order', 'bulk', 'wholesale', 'large order', 'quantity'],
             'answer' => "📊 Yes, we support bulk orders! For large quantities:\n• Order directly through platform\n• Or contact farmer for custom pricing\n• Perfect for events, restaurants, families"],

            // ==================== FARMERS ====================
            ['keywords' => ['farmer', 'farmers', 'growers', 'producers', 'who are farmers'],
             'answer' => "👨‍🌾 Our farmers are verified local growers — independent producers from your community. Each one is vetted to ensure quality, freshness, and fair practices."],

            ['keywords' => ['farmer verification', 'verified', 'verification', 'how are farmers verified'],
             'answer' => "✅ Farmers are verified through:\n• Identity verification\n• Market stall registration\n• Community recommendations\n• Quality checks\n\nOnly trustworthy growers are listed!"],

            ['keywords' => ['become a farmer', 'register as farmer', 'join as farmer', 'farmer registration', 'be a farmer'],
             'answer' => "🚜 To become a MarketLink farmer:\n1. Click 'Register as Farmer'\n2. Fill in your farm details\n3. Wait for admin approval\n4. Start listing your products!\n\nIt's FREE and takes 5 minutes."],

            ['keywords' => ['farmer commission', 'commission', 'fees', 'farmer fees', 'charges'],
             'answer' => "💰 MarketLink charges zero commission to farmers. You keep 100% of your sales. We believe in fair economics for local growers!"],

            ['keywords' => ['farmer dashboard', 'farmer panel', 'dashboard'],
             'answer' => "📊 Farmer dashboard shows:\n• Total orders & revenue\n• Pending & completed orders\n• Best-selling products\n• Weekly/monthly sales charts\n• Customer reviews\n• Profile management"],

            ['keywords' => ['contact farmer', 'farmer contact', 'reach farmer'],
             'answer' => "📞 Farmer contact details are shown on:\n• Product detail page\n• Order detail page\n• Farmer profile page\n\nYou can call or visit them directly!"],

            // ==================== PRODUCTS ====================
            ['keywords' => ['products', 'product', 'items', 'produce'],
             'answer' => "🥬 Product categories on MarketLink:\n• Vegetables (tomatoes, potatoes, greens)\n• Fruits (apples, berries, citrus)\n• Dairy (milk, cheese, yogurt)\n• Baked goods (bread, pastries)\n• Honey & preserves\n• Eggs & poultry\n• And more!"],

            ['keywords' => ['categories', 'category', 'product categories', 'types'],
             'answer' => "🥬 Product categories on MarketLink:\n• Vegetables (tomatoes, potatoes, greens)\n• Fruits (apples, berries, citrus)\n• Dairy (milk, cheese, yogurt)\n• Baked goods (bread, pastries)\n• Honey & preserves\n• Eggs & poultry\n• And more!"],

            ['keywords' => ['organic', 'organic food', 'organic products', 'chemical free'],
             'answer' => "🌱 Many of our farmers grow organic produce! Look for the 'organic' tag or filter. Not all products are certified organic, but all are locally grown."],

            ['keywords' => ['seasonal', 'seasonal produce', 'season', 'in season'],
             'answer' => "🍂 Seasonal produce means fruits and vegetables harvested at their natural peak. Better taste, more nutrients, lower prices. Farmers update weekly stock based on season!"],

            ['keywords' => ['availability', 'in stock', 'stock', 'available'],
             'answer' => "📦 Product availability shown in real-time:\n• Available — Ready to order\n• Low stock — Only few left\n• Sold out — Out of stock\n\nCheck the product page for exact quantity!"],

            ['keywords' => ['new products', 'fresh stock', 'new arrival'],
             'answer' => "✨ Farmers add new products weekly — usually before market day. Follow your favorite farmers to get notified when they list fresh items!"],

            ['keywords' => ['quality', 'quality assurance', 'product quality', 'freshness'],
             'answer' => "⭐ Quality is our priority:\n• Every farmer is verified\n• Real reviews from customers\n• Real-time stock prevents overselling\n• Direct connection = freshest produce"],

            ['keywords' => ['price', 'prices', 'pricing', 'how prices are set', 'cost', 'rate'],
             'answer' => "💵 Prices are set by farmers, not by MarketLink. This ensures:\n• Fair pricing for growers\n• No hidden commission\n• Direct farmer-to-customer pricing\n• Transparent costs"],

            ['keywords' => ['cheap', 'affordable', 'budget', 'low price', 'discount'],
             'answer' => "💰 Since we cut out middlemen, prices are typically lower than retail. Plus you get fresher produce. Win-win!"],

            // ==================== VEGETABLES ====================
            ['keywords' => ['tomato', 'tomatoes'],
             'answer' => "🍅 Fresh tomatoes on MarketLink come in varieties:\n• Regular red tomatoes\n• Heirloom tomatoes (colorful!)\n• Cherry tomatoes\n• Roma tomatoes\n\nBest in summer. Keep at room temp, not fridge!"],

            ['keywords' => ['potato', 'potatoes', 'aloo'],
             'answer' => "🥔 Fresh potatoes from local farms! Best varieties:\n• Russet (baking)\n• Yukon Gold (all-purpose)\n• Red potatoes (boiling)\n\nStore in cool, dark place. Lasts weeks!"],

            ['keywords' => ['onion', 'onions', 'pyaz'],
             'answer' => "🧅 Local onions are flavorful and long-lasting. Red, yellow, and white varieties available. Store in dry, ventilated area. Lasts weeks!"],

            ['keywords' => ['carrot', 'carrots', 'gajar'],
             'answer' => "🥕 Farm-fresh carrots — sweeter and crunchier than store-bought! Great for:\n• Salads\n• Juices\n• Roasting\n• Snacking\n\nStore in fridge up to 2 weeks."],

            ['keywords' => ['spinach', 'palak'],
             'answer' => "🥬 Fresh spinach is packed with iron, calcium, and vitamins. Best consumed within 2-3 days of harvest. Refrigerate in a damp cloth!"],

            ['keywords' => ['lettuce', 'salad leaves'],
             'answer' => "🥗 Farm-fresh lettuce available in:\n• Romaine\n• Iceberg\n• Butterhead\n• Mixed greens\n\nWash before use, refrigerate in airtight bag."],

            ['keywords' => ['cucumber', 'cucumbers', 'kheera'],
             'answer' => "🥒 Fresh cucumbers — perfect for salads, raita, and pickles. High water content (95%). Refrigerate and use within a week."],

            ['keywords' => ['pepper', 'peppers', 'capsicum', 'shimla mirch', 'bell pepper'],
             'answer' => "🌶️ Peppers available:\n• Bell peppers (red, yellow, green)\n• Hot peppers (chili, jalapeño)\n• Sweet peppers\n\nRich in Vitamin C. Great for stir-fry!"],

            ['keywords' => ['broccoli'],
             'answer' => "🥦 Fresh broccoli — high in fiber and vitamins. Steam, roast, or stir-fry. Store in fridge for up to 5 days."],

            ['keywords' => ['cauliflower', 'gobhi'],
             'answer' => "🥬 Farm-fresh cauliflower — versatile vegetable. Roast, curry, or rice substitute. Rich in Vitamin C."],

            ['keywords' => ['garlic', 'lehsun'],
             'answer' => "🧄 Fresh garlic — natural antibiotic and flavor enhancer. Store in cool, dry place. Lasts months!"],

            ['keywords' => ['ginger', 'adrak'],
             'answer' => "🫚 Fresh ginger — great for teas, curries, and health. Refrigerate up to 3 weeks, freeze for longer."],

            ['keywords' => ['chili', 'chilli', 'mirchi', 'chillies'],
             'answer' => "🌶️ Fresh chili peppers — from mild to very hot! Great for spice lovers. Refrigerate up to 1 week."],

            ['keywords' => ['pumpkin', 'kaddu'],
             'answer' => "🎃 Fresh pumpkin — great for soups, curries, and pies! Rich in Vitamin A. Lasts weeks in cool place."],

            ['keywords' => ['corn', 'makai', 'sweet corn'],
             'answer' => "🌽 Sweet corn — best consumed fresh! Roast, boil, or grill. Peak season: summer."],

            ['keywords' => ['mushroom', 'mushrooms'],
             'answer' => "🍄 Fresh mushrooms — several varieties available. Keep in paper bag in fridge. Use within a week."],

            ['keywords' => ['eggplant', 'brinjal', 'baingan', 'aubergine'],
             'answer' => "🍆 Fresh eggplant — great for curries, grills, and bakes. Choose firm, glossy ones. Refrigerate up to a week."],

            ['keywords' => ['beetroot', 'beet', 'chukandar'],
             'answer' => "🥗 Fresh beetroot — great for salads, juices, and roasts. Rich in iron and folate. Store in fridge for weeks."],

            ['keywords' => ['cabbage', 'band gobi'],
             'answer' => "🥬 Fresh cabbage — great for salads, stir-fry, and pickles. Store in fridge for up to 2 weeks."],

            ['keywords' => ['zucchini', 'courgette'],
             'answer' => "🥒 Fresh zucchini — versatile summer squash. Great for grilling, baking, and stir-fry. Refrigerate up to 1 week."],

            ['keywords' => ['radish', 'mooli'],
             'answer' => "🌶️ Fresh radish — peppery and crunchy! Great for salads and pickles. Refrigerate up to 1 week."],

            ['keywords' => ['green beans', 'beans', 'french beans'],
             'answer' => "🫛 Fresh green beans — crisp and nutritious! Steam, sauté, or roast. Refrigerate up to 1 week."],

            ['keywords' => ['peas', 'matar'],
             'answer' => "🫛 Fresh peas — sweet and tender! Best in spring. Great for curries, salads, and rice. Refrigerate in pods."],

            ['keywords' => ['sweet potato', 'shakarkandi'],
             'answer' => "🍠 Fresh sweet potato — sweet, nutritious, and versatile! Roast, mash, or bake. Store in cool, dark place for weeks."],

            ['keywords' => ['turnip', 'shalgam'],
             'answer' => "🥬 Fresh turnip — mild and sweet. Great for soups, roasts, and mashes. Store in fridge for up to 2 weeks."],

            // ==================== FRUITS ====================
            ['keywords' => ['apple', 'apples', 'saib'],
             'answer' => "🍎 Fresh apples — crisp, sweet, and juicy! Varieties vary by season. Store in fridge crisper for 2-3 weeks."],

            ['keywords' => ['banana', 'bananas', 'kela'],
             'answer' => "🍌 Fresh bananas — rich in potassium. Best at room temp. Refrigerate only when very ripe."],

            ['keywords' => ['orange', 'oranges', 'santra'],
             'answer' => "🍊 Fresh oranges — juicy and Vitamin C packed! Peak season: winter. Store at room temp or fridge."],

            ['keywords' => ['mango', 'mangoes', 'aam'],
             'answer' => "🥭 Juicy mangoes — the king of fruits! Varieties vary by region. Ripen at room temp, refrigerate when ripe. Peak season: summer!"],

            ['keywords' => ['strawberry', 'strawberries'],
             'answer' => "🍓 Fresh strawberries — sweet and aromatic! Best consumed within 2-3 days. Refrigerate unwashed."],

            ['keywords' => ['blueberry', 'blueberries'],
             'answer' => "🫐 Fresh blueberries — antioxidant-rich! Great for smoothies, pancakes, and snacking. Refrigerate up to 1 week."],

            ['keywords' => ['grape', 'grapes', 'angoor'],
             'answer' => "🍇 Fresh grapes — sweet and refreshing! Wash before eating. Refrigerate in ventilated bag. Peak: late summer."],

            ['keywords' => ['watermelon', 'tarbooz'],
             'answer' => "🍉 Juicy watermelon — 92% water, perfect for summer! Choose firm, heavy ones with creamy yellow spot. Refrigerate after cutting."],

            ['keywords' => ['peach', 'peaches', 'aadoo'],
             'answer' => "🍑 Sweet peaches — juicy summer fruit! Ripen at room temp, refrigerate when soft. Great for pies & smoothies."],

            ['keywords' => ['pear', 'pears', 'nashpati'],
             'answer' => "🍐 Fresh pears — sweet and buttery. Ripen at room temp. Refrigerate when ripe. Great for salads!"],

            ['keywords' => ['pineapple', 'ananas'],
             'answer' => "🍍 Fresh pineapple — tropical & tangy! Choose heavy ones with sweet smell. Refrigerate after cutting."],

            ['keywords' => ['papaya'],
             'answer' => "🍈 Fresh papaya — great for digestion! Rich in Vitamin C. Ripen at room temp, refrigerate when ripe."],

            ['keywords' => ['pomegranate', 'anar'],
             'answer' => "🍎 Fresh pomegranate — antioxidant powerhouse! Sweet-tart seeds. Store at room temp or fridge for weeks."],

            ['keywords' => ['kiwi'],
             'answer' => "🥝 Fresh kiwi — tangy and Vitamin C rich! Ripen at room temp, refrigerate when soft. Great for smoothies."],

            ['keywords' => ['lemon', 'lemons', 'nimbu'],
             'answer' => "🍋 Fresh lemons — great for drinks, cooking, and health! Store at room temp or fridge. Lasts weeks."],

            ['keywords' => ['avocado', 'avocados'],
             'answer' => "🥑 Fresh avocados — creamy and healthy fat! Ripen at room temp, refrigerate when ripe. Great for toast & guacamole."],

            ['keywords' => ['cherry', 'cherries'],
             'answer' => "🍒 Fresh cherries — sweet and juicy! Peak season: summer. Refrigerate unwashed for up to 1 week."],

            ['keywords' => ['plum', 'plums', 'aloo bukhara'],
             'answer' => "🍑 Fresh plums — sweet-tart and juicy! Ripen at room temp, refrigerate when soft. Great for snacking."],

            ['keywords' => ['apricot', 'apricots', 'khubani'],
             'answer' => "🍑 Fresh apricots — sweet and nutritious! Peak: summer. Refrigerate when ripe, use within a week."],

            ['keywords' => ['fig', 'figs', 'anjeer'],
             'answer' => "🍈 Fresh figs — sweet and delicate! Best consumed within 2 days. Refrigerate and bring to room temp before eating."],

            ['keywords' => ['date', 'dates', 'khajoor'],
             'answer' => "🌴 Fresh dates — natural sweetness and energy! Great for snacking and desserts. Store at room temp."],

            ['keywords' => ['melon', 'muskmelon', 'kharbooza'],
             'answer' => "🍈 Fresh muskmelon — sweet and refreshing! Choose fragrant ones. Refrigerate after cutting."],

            ['keywords' => ['guava', 'amrood'],
             'answer' => "🍈 Fresh guava — rich in Vitamin C! Sweet-tart flavor. Store at room temp or fridge. Great for juices."],

            ['keywords' => ['lychee', 'litchi'],
             'answer' => "🍇 Fresh lychee — sweet and aromatic! Peak: summer. Refrigerate and consume within a few days."],

            // ==================== DAIRY ====================
            ['keywords' => ['milk', 'doodh'],
             'answer' => "🥛 Fresh local milk — often from grass-fed cows. Boil before use if unpasteurized. Refrigerate and use within 3-4 days."],

            ['keywords' => ['cheese', 'paneer'],
             'answer' => "🧀 Fresh cheese & paneer available! Farm-made, no preservatives. Refrigerate and use within a week."],

            ['keywords' => ['yogurt', 'yoghurt', 'dahi'],
             'answer' => "🥣 Fresh yogurt — probiotic-rich! Farm-made, creamy. Refrigerate up to 1 week. Great for raita & smoothies."],

            ['keywords' => ['butter', 'makhan'],
             'answer' => "🧈 Fresh farm butter — creamy and flavorful! Refrigerate. Lasts weeks. Great for baking & toast."],

            ['keywords' => ['cream', 'malai'],
             'answer' => "🥛 Fresh cream — great for desserts, curries, and coffee! Refrigerate and use within a week."],

            ['keywords' => ['ghee'],
             'answer' => "🧈 Pure desi ghee — rich flavor and aroma! Store at room temp. Lasts months. Great for cooking."],

            // ==================== BAKED GOODS ====================
            ['keywords' => ['bread', 'sourdough'],
             'answer' => "🍞 Fresh sourdough & artisan breads! Baked daily by local bakers. Best consumed within 2-3 days. Freeze for longer."],

            ['keywords' => ['cake', 'cakes'],
             'answer' => "🎂 Local bakers offer fresh cakes! Custom orders often available. Contact baker directly through platform."],

            ['keywords' => ['pastry', 'pastries'],
             'answer' => "🥐 Fresh pastries — croissants, danishes, and more! Best on day of purchase."],

            ['keywords' => ['cookies', 'biscuits'],
             'answer' => "🍪 Homemade cookies & biscuits! Various flavors. Store in airtight container for up to a week."],

            ['keywords' => ['pie', 'pies'],
             'answer' => "🥧 Fresh pies — sweet and savory! Made with local ingredients. Best consumed within 2 days."],

            // ==================== HONEY & PRESERVES ====================
            ['keywords' => ['honey', 'shahad'],
             'answer' => "🍯 Raw local honey — natural, unfiltered! Contains local pollen (great for allergies). Store at room temp, never refrigerate. Lasts years!"],

            ['keywords' => ['jam', 'jams', 'preserves'],
             'answer' => "🍓 Homemade jams & preserves — made from seasonal fruits! Refrigerate after opening. Lasts months unopened."],

            ['keywords' => ['pickle', 'pickles', 'achaar'],
             'answer' => "🥒 Homemade pickles — traditional recipes! Great with meals. Store in cool, dry place or refrigerate."],

            // ==================== EGGS & POULTRY ====================
            ['keywords' => ['egg', 'eggs', 'ande'],
             'answer' => "🥚 Fresh farm eggs — from free-range chickens! Better taste and nutrition than store-bought. Refrigerate up to 3 weeks."],

            ['keywords' => ['chicken', 'murgh'],
             'answer' => "🍗 Farm-raised chicken — some farmers offer fresh poultry. Contact farmer for availability. Cook thoroughly."],

            // ==================== HEALTH & NUTRITION ====================
            ['keywords' => ['healthy', 'health', 'nutrition', 'nutritious', 'wellness'],
             'answer' => "💚 Local & fresh produce is healthier because:\n• More nutrients (picked fresh)\n• No long transport = less nutrient loss\n• No preservatives or chemicals\n• Seasonal = natural & balanced\n\nBetter for you and the planet!"],

            ['keywords' => ['vitamins', 'minerals', 'nutrients', 'nutritional'],
             'answer' => "🍎 Fresh fruits and vegetables are packed with:\n• Vitamin C (citrus, peppers)\n• Vitamin A (carrots, greens)\n• Iron (spinach, beets)\n• Fiber (all veggies)\n• Antioxidants (berries)\n\nEating local = eating nutritious!"],

            ['keywords' => ['weight loss', 'diet', 'low calorie', 'lose weight', 'slim'],
             'answer' => "🥗 Fresh produce is perfect for weight management:\n• Low in calories\n• High in fiber (keeps you full)\n• Rich in water\n• No added sugars\n\nStock up on veggies & fruits!"],

            ['keywords' => ['diabetes', 'sugar free', 'sugar-free', 'blood sugar'],
             'answer' => "🍃 Many vegetables are diabetes-friendly:\n• Leafy greens\n• Broccoli, cauliflower\n• Cucumber, zucchini\n• Tomatoes, peppers\n\nConsult your doctor for specific advice."],

            ['keywords' => ['heart health', 'cholesterol', 'heart', 'cardio'],
             'answer' => "❤️ Heart-healthy picks:\n• Oats (some bakers offer)\n• Leafy greens\n• Berries\n• Nuts (occasionally)\n• Olive oil (if available)\n\nEat colorful produce daily!"],

            ['keywords' => ['pregnancy', 'pregnant', 'expecting', 'prenatal'],
             'answer' => "🤰 Great pregnancy foods from MarketLink:\n• Leafy greens (folate)\n• Oranges (Vitamin C)\n• Dairy (calcium)\n• Eggs (protein)\n• Berries (antioxidants)\n\nAlways consult your doctor first!"],

            ['keywords' => ['kids', 'children', 'baby food', 'baby', 'toddler', 'child'],
             'answer' => "👶 Kid-friendly picks:\n• Sweet fruits (mango, banana, grapes)\n• Fresh yogurt\n• Mild veggies (carrots, corn)\n• Homemade breads\n\nSteam & puree for babies!"],

            // ==================== ACCOUNT ====================
            ['keywords' => ['register', 'registration', 'sign up', 'signup', 'create account'],
             'answer' => "📝 To create an account:\n1. Click 'Register' in the navbar\n2. Fill in your details\n3. Verify email (if required)\n4. Start shopping!\n\nTakes less than 1 minute."],

            ['keywords' => ['login', 'log in', 'sign in', 'signin'],
             'answer' => "🔐 To login:\n1. Click 'Sign In'\n2. Enter email & password\n3. Click 'Sign In'\n\nForgot password? Use 'Forgot?' link!"],

            ['keywords' => ['forgot password', 'reset password', 'password reset', 'forgot'],
             'answer' => "🔑 If you forgot password:\n1. Click 'Forgot?' on login page\n2. Enter your email\n3. Check email for reset link\n4. Create new password"],

            ['keywords' => ['change password', 'update password', 'new password'],
             'answer' => "🔐 To change password:\n1. Go to Profile\n2. Click 'Change Password'\n3. Enter old & new passwords\n4. Save"],

            ['keywords' => ['profile', 'update profile', 'edit profile', 'my profile'],
             'answer' => "👤 To update profile:\n1. Go to Profile from dashboard\n2. Edit your details\n3. Save changes\n\nYou can update name, email, address, phone, etc."],

            ['keywords' => ['delete account', 'close account', 'delete my account', 'remove account'],
             'answer' => "😢 To delete your account, please contact our support team. We'll process within 7 days. Note: Order history will be preserved as required by law."],

            ['keywords' => ['logout', 'log out', 'sign out', 'signout'],
             'answer' => "👋 To sign out:\n1. Click your avatar in navbar\n2. Click 'Sign Out'\n\nStay safe — always logout on shared devices!"],

            // ==================== FAVORITES ====================
            ['keywords' => ['favorite', 'favourite', 'favorites', 'favourites', 'save product', 'saved'],
             'answer' => "❤️ To save a favorite:\n1. Open any product\n2. Click the heart icon\n3. It'll be saved to your favorites!\n\nView all favorites from dashboard."],

            ['keywords' => ['view favorites', 'my favorites', 'my favourites', 'see favorites'],
             'answer' => "❤️ To view favorites:\n1. Go to dashboard\n2. Click 'Favorites'\n3. See saved products & farmers\n\nOr via navbar → avatar → Saved Favorites"],

            ['keywords' => ['unfavorite', 'unfavourite', 'remove favorite', 'unsave'],
             'answer' => "💔 To remove a favorite:\n1. Open your favorites page\n2. Click the filled heart icon\n3. It'll be removed"],

            // ==================== REVIEWS ====================
            ['keywords' => ['review', 'reviews', 'write review', 'leave review', 'rating'],
             'answer' => "⭐ To write a review:\n1. Complete a purchase\n2. Open the product or farmer page\n3. Click 'Write a Review'\n4. Rate & comment\n\nYour feedback helps others!"],

            ['keywords' => ['review guidelines', 'review rules', 'guidelines'],
             'answer' => "📝 Review guidelines:\n• Be honest and specific\n• Mention quality, freshness, service\n• No offensive language\n• Reviews are public\n\nHelp the community decide!"],

            ['keywords' => ['edit review', 'delete review'],
             'answer' => "✏️ Reviews can't be edited after submission. To delete, contact support. Only admin can remove reviews (for policy violations)."],

            // ==================== NOTIFICATIONS ====================
            ['keywords' => ['notifications', 'notification', 'alerts', 'alert'],
             'answer' => "🔔 You'll get notifications for:\n• Order status changes\n• Pickup reminders\n• Price drops on favorites\n• New products from favorite farmers\n\nEnable in browser settings!"],

            ['keywords' => ['price drop alert', 'price alerts', 'price drop', 'discount alert'],
             'answer' => "💰 Price drop alerts coming soon! Follow your favorite products and we'll notify you when prices change. Stay tuned!"],

            // ==================== TECHNICAL ====================
            ['keywords' => ['mobile app', 'android', 'ios', 'app', 'download'],
             'answer' => "📱 MarketLink works great on mobile browsers! A dedicated mobile app is in development. For now, add to home screen for app-like experience."],

            ['keywords' => ['bug', 'error', 'not working', 'website not working', 'issue', 'problem'],
             'answer' => "🐛 Sorry for the issue! Try:\n1. Refresh the page\n2. Clear browser cache\n3. Try another browser\n4. If still broken, contact support"],

            ['keywords' => ['contact support', 'customer support', 'support', 'help me', 'contact us'],
             'answer' => "📧 Contact support:\n• Email: hello@marketlink.com\n• Phone: +1 (555) 123-4567\n• Hours: Mon-Fri 9 AM – 6 PM\n\nOr use this chatbot anytime!"],

            // ==================== MISC ====================
            ['keywords' => ['recipe', 'recipes', 'cooking', 'how to cook', 'cook'],
             'answer' => "👨‍🍳 Recipe ideas using MarketLink produce:\n• Tomato soup (fresh tomatoes + garlic)\n• Garden salad (lettuce + cucumber + tomato)\n• Fruit smoothie (banana + berries + yogurt)\n• Roasted veggies (carrots + potatoes + peppers)\n\nMore recipes on our blog soon!"],

            ['keywords' => ['storage', 'storage tips', 'how to store', 'keep fresh'],
             'answer' => "📦 Storage tips:\n• Leafy greens — fridge, damp cloth\n• Root veggies — cool dark place\n• Berries — fridge, unwashed\n• Honey — room temp, airtight\n• Eggs — fridge, original carton"],

            ['keywords' => ['seasonal calendar', 'what is in season', 'calendar'],
             'answer' => "📅 Seasonal produce guide:\n• Spring — peas, spinach, strawberries\n• Summer — tomatoes, mangoes, corn\n• Fall — pumpkin, apples, squash\n• Winter — citrus, root veggies, kale\n\nAsk us for specific month!"],
        ];
    }

    // ==================================================================
    // HELP TEXT
    // ==================================================================
    private function getHelpText(): string
    {
        return "🤖 I can help you with:\n\nYour Account:\n• Cart total\n• Order count\n• Total spent\n• Pending/cancelled/completed orders\n• Products you've ordered\n• Top products\n• Favorites\n• Pickup schedule\n\nAbout MarketLink:\n• What is MarketLink\n• How it works\n• Payment info\n• Delivery/pickup\n• Farmer info\n\nProducts:\n• Vegetables (onion, tomato, potato, carrot...)\n• Fruits (apple, mango, banana...)\n• Dairy (milk, cheese, yogurt...)\n• Honey, bread, eggs\n• Seasonal produce\n• Storage tips\n• Recipes\n\nSupport:\n• Account help\n• Technical issues\n• Contact information\n\nJust type your question!";
    }

    // ==================================================================
    // TOPICS TEXT
    // ==================================================================
    private function getTopicsText(): string
    {
        return "📚 Topics I can answer:\n\n🌱 MarketLink — what, why, how, mission\n🛒 Orders — place, track, cancel, modify\n💳 Payment — how, when, security\n🚚 Pickup — location, time, reminders\n👨‍🌾 Farmers — verification, becoming one\n🥬 Products — categories, availability, pricing\n🥕 Vegetables — onion, tomato, potato, carrot, and 20+ more\n🍎 Fruits — apple, mango, banana, and 20+ more\n🥛 Dairy — milk, cheese, yogurt, butter\n🍞 Baked — bread, cake, pastries\n🍯 Honey — local raw honey & preserves\n🥚 Eggs & Poultry\n💚 Health — nutrition, diets, pregnancy\n🌍 Sustainability — eco-friendly, local economy\n👤 Account — register, login, profile\n❤️ Favorites — save, view, remove\n⭐ Reviews — write, edit\n🔔 Notifications\n📱 Technical — app, bugs, support\n\nJust ask anything!";
    }
}