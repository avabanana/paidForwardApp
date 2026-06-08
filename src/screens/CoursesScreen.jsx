import React, { useEffect, useMemo, useState } from 'react';
import ProgressBar from '../components/ProgressBar';
import { supabase } from '../supabaseClient'; 

// --- 14+ COURSE DATA (UNTOUCHED) ---
const adultCoursesData = [
  {
    id: 0,
    title: 'Earning & Growing Your Money',
    emoji: '🚀',
    color: '#0056D2', // Professional Blue
    gradient: 'linear-gradient(135deg,#0056D2,#00419e)',
    tag: 'Course',
    description: 'Master the fundamentals of cash flow, budgeting, and long-term wealth building with industry-standard practices.',
    lessons: [
      {
        title: 'Make Your First Budget',
        info: [
          'A budget is the foundation of all financial progress. List every income source (job, side work, gifts) and every expense — fixed (rent, phone plan, subscriptions) and variable (groceries, transportation, entertainment). The gap between them is your financial margin.',
          '"Pay yourself first" is the most powerful savings principle: automate a savings transfer the day your paycheck arrives. You cannot spend money that isn\'t in your checking account. Even $25/week grows to $1,300/year.',
          'The zero-based budgeting method assigns every dollar a "job" — savings, bills, fun — until your income minus all categories equals zero. This eliminates passive overspending and forces intentionality.',
          'Tracking irregular expenses is where most budgets fail. Annual costs like insurance, car registration, or holiday spending should be divided by 12 and set aside monthly as a "sinking fund" so they never catch you off guard.',
          'Your budget should be reviewed and adjusted every month — income changes, expenses creep up, and priorities shift. A budget that isn\'t revisited is just a wish list, not a financial plan.',
          'Lifestyle inflation is a silent budget killer: as income rises, spending tends to rise equally, leaving savings unchanged. Intentionally keeping expenses flat as income grows is how wealth is actually built.'
        ],
        quiz: [
          { q: 'A "zero-based budget" means:', choices: ['Every dollar of income is assigned to a specific category until income minus expenses = 0', 'You spend your entire paycheck on personal wants until your bank account reaches exactly 0', 'You delete all your previous savings every month to start fresh with a zero balance', 'You only create a budget if your current savings account has zero dollars remaining'], a: 0 },
          { q: 'A "sinking fund" is best described as:', choices: ['Money set aside monthly for known future irregular expenses like car registration', 'A low-interest savings account that loses its total value over a long period of time', 'A separate emergency fund used only for unknown and sudden medical catastrophes', 'A fund used exclusively for daily entertainment and eating out at luxury restaurants'], a: 0 },
          { q: 'If you track your spending and realize you\'ve been overspending on dining, the most effective adjustment is:', choices: ['Set a specific dollar cap for dining and meal-prep more often at home', 'Delete the dining category from your budget so you do not have to see the cost', 'Earn more money from a second job so that overspending does not matter anymore', 'Only eat out on weekends while ignoring the total cost of the meals you order'], a: 0 },
          { q: 'Lifestyle inflation occurs when:', choices: ['Your spending rises proportionally with every income increase, preventing savings growth', 'The prices of all common goods and services rise due to broader economic inflation', 'You intentionally choose to upgrade your lifestyle after hitting a major savings goal', 'Your fixed monthly expenses grow much faster than your variable expenses each year'], a: 0 },
          { q: '"Paying yourself first" is most effectively done by:', choices: ['Automating a savings transfer on payday before any discretionary spending occurs', 'Putting whatever money is left over into savings at the very end of every month', 'Manually transferring money to your savings account whenever you happen to remember', 'Setting a large savings goal but not moving the physical money into an account yet'], a: 0 },
          { q: 'Which of the following is a FIXED expense?', choices: ['Monthly rent or mortgage payment', 'Weekly grocery and household bill', 'Dining out with friends and family', 'Gasoline and fuel for your vehicle'], a: 0 },
          { q: 'Why should you review your budget every month?', choices: ['Because income, expenses, and priorities change and a static budget becomes inaccurate', 'Because all major banks require a monthly budget submission for your accounts', 'So you can spend your money more freely without feeling any guilt each month', 'Monthly review is optional because quarterly reviews are sufficient for most people'], a: 0 },
          { q: 'Someone earns $3,000/month and spends $3,000/month on random things. According to ZBB, they should:', choices: ['Ensure every dollar is intentionally assigned to categories like savings and bills', 'Continue their current approach since the total income equals the total expenses', 'Earn more money before worrying about the specific details of a monthly budget', 'Focus only on reducing their largest single expense such as rent or insurance'], a: 0 },
          { q: 'Variable expenses are:', choices: ['Costs that change month-to-month and are often easier to reduce than fixed costs', 'Expenses that never change regardless of your personal behavior or choices', 'Only relevant for people who have a very irregular income from freelance work', 'Always lower than fixed expenses in every healthy and balanced monthly budget'], a: 0 }
        ]
      },
      {
        title: 'Grow With Goals',
        info: [
          'Financial goals require specificity to succeed. "I want to save more" is not a goal — "I will save $2,400 in 12 months by transferring $200 on the 1st of every month" is actionable and measurable.',
          'SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) are the standard framework because vague intentions produce vague results. Every financial goal should pass all five criteria.',
          'Short-term goals (under 1 year) include emergency funds, vacation savings, and tech purchases. Medium-term (1–5 years) cover a car down payment or moving expenses. Long-term (5+ years) involve home ownership, higher education, or retirement.',
          'Goal prioritization matters: financial experts generally recommend building a starter emergency fund first, then tackling high-interest debt, then saving for other goals simultaneously. Doing everything at once often means accomplishing nothing.',
          'Automated contributions remove willpower from the equation. Direct deposit splits, automatic transfers, and round-up savings apps make goal-funding nearly effortlessly and remove the temptation to spend first.',
          'Progress checkpoints — weekly spending reviews or monthly savings tallies — dramatically increase follow-through. Behavioral research shows that simply measuring a goal increases the likelihood of achieving it by over 40%.',
          'When you hit a goal, celebrate intentionally but don\'t abandon the system. Immediately redirect the freed-up cash flow to the next priority goal rather than letting it dissolve into lifestyle spending.'
        ],
        quiz: [
          { q: 'Which of these is a properly-formed SMART financial goal?', choices: ['"Save $1,800 for an emergency fund by December 31 by depositing $150 per month"', '"Try to save a lot more money starting soon so I can buy a new car later"', '"Be much better with my money this year than I was during the last year"', '"Try to spend less on things I don\'t really need so I can save up cash"'], a: 0 },
          { q: 'According to most financial experts, the recommended order of priorities is:', choices: ['Starter fund → pay high-interest debt → build full fund → save for other goals', 'Invest first, then save, then pay debt when you have extra cash at the end', 'Pay off all debt before saving any money at all for an emergency reserve', 'Save for retirement first and ignore your emergency fund until debt is clear'], a: 0 },
          { q: 'Why does automating savings contributions outperform manual transfers?', choices: ['It removes reliance on willpower and prevents spending the money before saving', 'Automated transfers earn much higher interest rates from national bank branches', 'Banks charge lower fees for automated systems than they do for manual transfers', 'It is the only method banks allow for high-interest savings account growth'], a: 0 },
          { q: 'Saving for a car down payment in 3 years is classified as:', choices: ['A medium-term financial goal (usually between one and five years of saving)', 'A short-term goal since it is under five years and involves a vehicle purchase', 'A long-term goal because it involves a very large amount of total saved cash', 'An emergency goal because vehicles are necessary for getting to a job on time'], a: 0 },
          { q: 'After achieving a major savings goal, the most financially sound next step is:', choices: ['Immediately redirect the monthly savings amount toward the next priority goal', 'Spend the saved funds as a personal reward for your good financial behavior', 'Stop saving temporarily and enjoy increased spending on luxury lifestyle items', 'Keep saving into the same account indefinitely without a new target in mind'], a: 0 },
          { q: 'Behavioral research on goal-setting suggests that:', choices: ['Measuring and tracking progress toward a goal significantly increases success', 'Writing goals down has no proven effect on the actual final financial outcomes', 'Only large financial goals are worth tracking formally in a personal budget', 'Goals should be kept private to avoid any external social or peer pressure'], a: 0 },
          { q: 'A person wants to retire comfortably. This is best described as which goal?', choices: ['Long-term, requiring decades of consistent contributions and investment growth', 'Medium-term, achievable within 3–5 years with very aggressive monthly saving', 'Short-term if you start early enough in your 20s with a professional job', 'An aspirational wish rather than a plannable and measurable financial goal'], a: 0 },
          { q: 'The primary reason financial goals should be time-bound is:', choices: ['Deadlines create urgency and allow you to calculate the monthly contribution', 'Banks require a timeline before opening a high-yield savings account for you', 'Time limits prevent you from saving too much money in one specific category', 'Goals without deadlines are not legally enforceable by the local civil courts'], a: 0 },
          { q: 'Why is "save more money" considered a poor financial goal?', choices: ['It lacks specificity, a dollar amount, and a clear deadline to act on', 'It is a goal that is too ambitious for most people to achieve in a year', 'Saving more money is actually not a recommended financial strategy for wealth', 'It doesn\'t account for the impact of inflation over a long period of time'], a: 0 }
        ]
      },
      {
        title: 'Smart Spending',
        info: [
          'Distinguishing needs from wants is harder than it sounds. Needs are things required for basic survival and functioning — shelter, food, transportation to work, healthcare. Wants enhance comfort or pleasure. Many "needs" (like a specific phone plan or car) are actually wants at a premium price point.',
          'The 24-to-72-hour waiting rule for discretionary purchases over $50 is one of the most evidence-backed tools against impulse spending. Studies show desire for non-essential items drops significantly after a waiting period.',
          'Subscription audit: the average household unknowingly pays for 3–4 forgotten subscriptions. Monthly recurring charges are psychologically invisible. Auditing every 6 months and canceling unused services is one of the fastest ways to reclaim $50–$150/month.',
          'Unit pricing — calculating cost per ounce, per use, or per serving — often reveals that "premium" brands are no more expensive than budget brands, and bulk purchases are occasionally worse value than they appear.',
          'The "cost-per-use" framework for large purchases: a $300 jacket worn 150 times costs $2/wear — better value than a $80 jacket worn 5 times. Spending more on durable, high-use items is often genuinely smarter than buying cheap replacements repeatedly.',
          'Opportunity cost is the invisible price of every purchase: money spent on one thing is money that cannot be invested, saved, or used for something else. A $6 daily coffee costs ~$2,190/year — invested at 7%, that\'s over $30,000 in 10 years.',
          'Price anchoring is a retail psychological tactic — showing an inflated "original" price makes a sale price feel like a deal even when it\'s not. Compare absolute prices against alternatives, not just against the struck-through price.'
        ],
        quiz: [
          { q: 'Using "cost-per-use", which is the smarter purchase?', choices: ['A $240 pair of shoes worn 120 times vs. a $60 pair worn 10 times', 'Always the cheaper upfront price regardless of durability or brand quality', 'The item with the highest brand recognition in the current retail market', 'Whichever item is currently on sale at the department store for the week'], a: 0 },
          { q: 'Why is the 24-hour waiting rule effective against impulse purchases?', choices: ['Desire for non-essential items tends to decrease significantly after a delay', 'It gives you more time to earn enough money before you buy the item', 'Stores are more likely to have a larger sale the very next day for you', 'It is a legally required waiting period for any purchase over fifty dollars'], a: 0 },
          { q: 'A "subscription audit" is valuable primarily because:', choices: ['Monthly charges are often invisible and people pay for unused services', 'It helps you find more subscriptions to add to your monthly budget plan', 'Banks require annual subscription reviews to keep your account active', 'Subscriptions are always more expensive than one-time digital purchases'], a: 0 },
          { q: 'Opportunity cost in spending decisions refers to:', choices: ['The value of what you give up when choosing to spend money one way', 'The original retail price before a discount is ever applied at checkout', 'The total cost of returning a purchase that you regret later that month', 'The sales taxes paid on purchases over a certain specific dollar amount'], a: 0 },
          { q: 'Which of the following is most accurately classified as a "want"?', choices: ['A $100/month gym membership when you have free outdoor workout options', 'Basic groceries used for cooking healthy meals at home for your family', 'Prescription medication for a chronic condition diagnosed by a doctor', 'Electricity used for heating your home in winter and lighting at night'], a: 0 },
          { q: 'Price anchoring is a retail tactic where:', choices: ['An inflated "original" price makes a sale price feel like a bargain deal', 'Prices are anchored to inflation rates and adjusted by stores every month', 'Stores charge different prices in different geographic regions of the country', 'Premium brands charge more to signal a higher level of luxury and quality'], a: 0 },
          { q: 'Calculating "unit price" (cost per ounce, serving, etc.) helps you:', choices: ['Compare value across sizes and brands to find the best actual deal', 'Determine the exact nutritional content of the food you are buying', 'Calculate the total sales tax before you reach the final checkout line', 'Find out which store has the best digital loyalty program for members'], a: 0 },
          { q: 'A person impulsively buys a $400 item on a credit card they cannot pay off:', choices: ['They pay $400 plus interest charges that accrue until it is fully paid', 'They pay exactly $400 regardless of the payment method they used to buy it', 'They pay $400 minus any rewards points earned on that specific purchase', 'They pay $400 but offset by any enjoyment derived from having the item'], a: 0 },
          { q: 'The most dangerous aspect of lifestyle inflation is:', choices: ['It silently consumes income increases and prevents your savings growth', 'It only affects high-income earners who have very large annual salaries', 'It causes an immediate financial crisis and is very easily noticed by all', 'It primarily impacts retirement accounts rather than your daily savings'], a: 0 }
        ]
      },
      {
        title: 'Side Income & Career Growth',
        info: [
          'Active income is traded directly for time — your salary or hourly rate. Passive income generates money with minimal ongoing effort after the initial setup: rental income, dividend portfolios, royalties, or digital products. True financial freedom typically requires moving from pure active income toward a mix.',
          'The most reliable way to increase income is to increase your skills\' market value. Certifications, specialized expertise, and demonstrable results (a portfolio, metrics from past work) compound over a career the same way investments compound over time.',
          'Side hustles that leverage existing skills command the highest rates. A software developer charging $100/hr for freelance work earns 3× more per hour than driving for a rideshare app. Monetizing what you already know is almost always more efficient than building new skills from scratch.',
          'The tax implications of side income are significant: every dollar of self-employment income above $400 requires filing Schedule SE and paying 15.3% self-employment tax on top of regular income tax. Understanding this is critical to pricing side work correctly — $50/hr self-employed nets roughly $35/hr after taxes.',
          'Negotiating your salary is the single highest-leverage financial action most employees never take. Studies consistently show that professionals who negotiate their starting salary earn $1M+ more over a 40-year career than those who accept the first offer. The expected value of negotiating is almost always positive.',
          'The "barbell" income strategy balances a stable primary income (low risk, steady cash flow) with a high-upside side project (higher risk, but capped downside since you still have your job). This lets you experiment without catastrophic financial risk.',
          'Burnout math: doubling income means nothing if it costs your health or relationships. The sustainable path to wealth is optimizing income-to-hours ratio, not raw hours. A $90,000 job requiring 40 hours/week is more financially efficient than a $120,000 job requiring 70 hours/week.'
        ],
        quiz: [
          { q: 'The key difference between active and passive income is:', choices: ['Active trades time for money; passive generates money with minimal ongoing effort', 'Passive income is illegal without a registered business entity', 'Active income is taxed more favorably than any passive source', 'Passive income only refers to dividends from stock market investments'], a: 0 },
          { q: 'Why does negotiating your starting salary matter so much?', choices: ['Salary gains compound over a career — the difference can exceed $1M', 'Most companies automatically lower offers if you don\'t negotiate them', 'Negotiation skills are required for management promotions later', 'Starting salary determines your maximum possible future earnings'], a: 0 },
          { q: 'Self-employment income above $400 triggers:', choices: ['Schedule SE filing and a 15.3% self-employment tax on net profit', 'A flat 30% federal withholding sent quarterly to the IRS', 'Automatic quarterly estimated tax payments via direct debit', 'An audit trigger requiring documentation of all business expenses'], a: 0 },
          { q: 'The most efficient side hustle typically:', choices: ['Leverages existing skills you already have at a high hourly rate', 'Requires building entirely new skills to access new markets', 'Involves physical labor that can be scaled with minimal capital', 'Starts with the lowest barrier to entry regardless of hourly rate'], a: 0 },
          { q: 'The "barbell" income strategy balances:', choices: ['A stable primary income with a high-upside side project', 'Aggressive investing with aggressive debt repayment simultaneously', 'Active and passive income at exactly 50/50 split from year one', 'High-risk freelancing with low-risk bond investments equally'], a: 0 },
          { q: 'True financial freedom typically requires:', choices: ['Shifting from pure active income toward a mix including passive sources', 'Earning over $200,000 per year in salaried employment', 'Owning real estate in at least two separate geographic markets', 'Working in finance or technology for maximum income potential'], a: 0 },
          { q: 'Evaluating income should consider hours required because:', choices: ['Income-to-hours ratio determines real financial efficiency', 'All jobs pay the same effective hourly rate after taxes', 'More hours always leads to faster wealth accumulation', 'Hourly rate is the primary factor lenders use for mortgages'], a: 0 },
          { q: 'A software developer freelancing at $100/hr is more efficient than rideshare because:', choices: ['It monetizes existing skills at a much higher rate per hour', 'Rideshare income is taxed at a higher rate than consulting', 'Software development has no self-employment tax requirements', 'Rideshare platforms take a 50% commission from all earnings'], a: 0 },
          { q: 'Career skill investment is similar to compound interest because:', choices: ['Specialized expertise increases market value exponentially over time', 'Certifications earn literal interest payments from employers', 'Both require government-approved accounts to generate returns', 'Skills and money both depreciate at roughly the same annual rate'], a: 0 }
        ]
      }
    ]
  },
  {
    id: 3,
    title: 'Investing Fundamentals',
    emoji: '📈',
    color: '#7c3aed',
    gradient: 'linear-gradient(135deg,#7c3aed,#a78bfa)',
    tag: 'Wealth Building',
    description: 'Learn how to put your money to work through stocks, index funds, and retirement accounts.',
    lessons: [
      {
        title: 'Stock Market Basics',
        info: [
          'A stock represents fractional ownership in a company. When you buy one share of Apple, you own a tiny piece of Apple Inc. — its profits, assets, and future growth. Stocks are bought and sold on exchanges like the NYSE and NASDAQ.',
          'Stock prices are driven by supply and demand, which is shaped by company earnings, economic data, investor sentiment, and future expectations. A company\'s stock can rise even when it\'s losing money if investors believe growth is coming.',
          'The difference between investing and speculating: investing is buying an asset with the expectation of long-term returns based on fundamentals. Speculating is betting on short-term price movement. Most individual investors lose money trying to speculate.',
          'Market capitalization (market cap) = share price × total shares outstanding. It\'s the most common measure of a company\'s size. Large-cap companies (>$10B) are generally more stable; small-cap companies (<$2B) carry more risk and more potential upside.',
          'Dividends are cash payments some companies make to shareholders from their profits, typically quarterly. Dividend-paying stocks (utilities, REITs, consumer staples) are favored by income investors. Growth stocks typically reinvest profits instead of paying dividends.',
          'Bear markets are defined as a 20%+ decline from recent highs. Bull markets are sustained upward trends. Historically, bear markets last an average of 9–16 months while bull markets last years — which is why staying invested long-term outperforms trying to exit during downturns.',
          'Individual stock picking underperforms index funds for the vast majority of investors. Studies consistently show that over 80% of actively managed funds fail to beat their benchmark index over a 10-year period. This is why passive index investing dominates modern financial advice.'
        ],
        quiz: [
          { q: 'What does owning a stock represent?', choices: ['Fractional ownership in the issuing company', 'A loan you make to the company', 'A guaranteed annual dividend payment', 'A government-backed savings certificate'], a: 0 },
          { q: 'A "bear market" is defined as:', choices: ['A market decline of 20% or more from recent highs', 'Any month where the market closes lower than it opened', 'A period with no new companies listing on exchanges', 'A market rising more than 20% in under 6 months'], a: 0 },
          { q: 'Why do most actively managed funds underperform index funds?', choices: ['Higher fees and the difficulty of consistently predicting markets', 'They invest in bonds rather than stocks by default', 'Fund managers intentionally reduce returns to limit tax liability', 'They are legally required to hold some cash at all times'], a: 0 },
          { q: 'Market capitalization is calculated as:', choices: ['Share price multiplied by total shares outstanding', 'Total company revenue divided by number of employees', 'Annual profit divided by the current stock price', 'Total assets minus total liabilities on the balance sheet'], a: 0 },
          { q: 'The key difference between investing and speculating is:', choices: ['Investing relies on fundamentals; speculation bets on short-term movement', 'Investing is illegal without a financial advisor license', 'Speculation always produces higher returns than investing', 'Investing only applies to real estate, not stock markets'], a: 0 },
          { q: 'A dividend is:', choices: ['A cash payment companies make to shareholders from profits', 'A fee charged by brokers for executing stock trades', 'The difference between a stock\'s high and low price', 'A penalty for selling a stock before one year passes'], a: 0 },
          { q: 'Small-cap stocks (under $2B market cap) generally carry:', choices: ['More risk and more potential upside than large-cap stocks', 'Less risk because smaller companies are easier to manage', 'Guaranteed dividend payments unlike larger companies', 'Government insurance similar to FDIC for bank accounts'], a: 0 },
          { q: 'What primarily drives stock prices up or down?', choices: ['Supply and demand shaped by earnings, data, and expectations', 'The Federal Reserve setting a price ceiling each quarter', 'Company founders buying and selling their own personal shares', 'The number of employees a company hires or fires monthly'], a: 0 },
          { q: 'Historically, which approach outperforms for most long-term investors?', choices: ['Passive index investing over stock picking and market timing', 'Actively trading stocks daily to capture short-term gains', 'Holding cash during uncertain periods and reinvesting later', 'Concentrating in a single high-conviction sector like tech'], a: 0 }
        ]
      },
      {
        title: 'Index Funds & ETFs',
        info: [
          'An index fund is a type of mutual fund or ETF designed to replicate the performance of a market index, like the S&P 500. Instead of picking individual stocks, you buy a tiny piece of every company in the index simultaneously.',
          'An ETF (Exchange-Traded Fund) trades on an exchange just like a stock — you can buy or sell it at any point during market hours. Most index funds are available as ETFs. The most popular ETFs include VTI (total US market), VOO (S&P 500), and VXUS (international stocks).',
          'The expense ratio is the annual fee charged by a fund, expressed as a percentage. Vanguard\'s VOO charges 0.03%/year — on a $10,000 investment, that\'s $3/year. Actively managed funds often charge 0.5–1.5%, which dramatically compounds against returns over decades.',
          'Diversification is the mathematical principle that combining uncorrelated assets reduces overall portfolio risk without proportionally reducing returns. Owning 500 stocks in an S&P 500 fund means no single company\'s failure can destroy your portfolio.',
          'The "three-fund portfolio" is a popular simple strategy: a US total market fund, an international fund, and a bond fund. It provides complete global diversification with just three holdings and is advocated by Vanguard\'s founder Jack Bogle.',
          'Rebalancing is the practice of periodically adjusting your portfolio back to its target allocation. If stocks surge and your 80/20 stock-bond split drifts to 90/10, you sell some stocks and buy bonds to restore balance. Most advisors recommend rebalancing annually or when any asset drifts more than 5% from target.',
          'Tax-loss harvesting is an advanced ETF strategy: selling a losing position to realize a tax loss (offsetting capital gains), then immediately buying a similar-but-not-identical ETF to maintain market exposure. This can add 0.5–1% to after-tax returns annually for taxable account holders.'
        ],
        quiz: [
          { q: 'What does an index fund do?', choices: ['Replicates the performance of a market index by holding its components', 'Allows fund managers to pick the highest-performing stocks only', 'Guarantees returns equal to the index regardless of market conditions', 'Invests exclusively in government bonds and treasury securities'], a: 0 },
          { q: 'An ETF differs from a standard mutual fund because:', choices: ['It trades on an exchange during market hours like a stock', 'It is only available to institutional investors and hedge funds', 'It holds a single stock rather than a basket of securities', 'It charges no expense ratio or management fees at all'], a: 0 },
          { q: 'The expense ratio of 0.03% vs 1.0% matters because:', choices: ['The difference compounds dramatically against returns over decades', 'Higher expense ratios are required for legal compliance', 'Only expense ratios below 0.5% are available to retail investors', 'Expense ratios only apply to bond funds, not stock funds'], a: 0 },
          { q: 'Diversification reduces risk because:', choices: ['Combining uncorrelated assets lowers volatility without killing returns', 'Owning more stocks guarantees at least one will be profitable', 'Diversified funds are insured by the government against loss', 'More holdings always means more dividends paid to investors'], a: 0 },
          { q: 'The three-fund portfolio consists of:', choices: ['US total market, international, and a bond fund', 'Large-cap, mid-cap, and small-cap US stocks only', 'Stocks, real estate, and cryptocurrency equally weighted', 'Three different S&P 500 ETFs from competing fund families'], a: 0 },
          { q: 'Portfolio rebalancing means:', choices: ['Restoring your target asset allocation when it drifts', 'Selling all holdings once a year and starting completely fresh', 'Adding new money only to your best-performing assets', 'Moving to 100% cash during periods of high volatility'], a: 0 },
          { q: 'Tax-loss harvesting involves:', choices: ['Selling a loser to realize a tax loss while buying a similar asset', 'Avoiding all capital gains by never selling any holdings', 'Moving investments into a Roth IRA to eliminate taxes', 'Donating losing stocks to charity for a full deduction'], a: 0 },
          { q: 'Which ETF ticker represents the total US stock market?', choices: ['VTI — Vanguard Total Stock Market ETF', 'VOO — Vanguard S&P 500 ETF specifically', 'VXUS — Vanguard Total International Stock ETF', 'BND — Vanguard Total Bond Market ETF'], a: 0 },
          { q: 'Jack Bogle\'s core investing philosophy was:', choices: ['Buy low-cost index funds and hold them for the long term', 'Actively trade to beat the market using technical analysis', 'Concentrate in a few high-conviction individual stocks', 'Time the market by moving to cash during corrections'], a: 0 }
        ]
      }
    ]
  },
  {
    id: 4,
    title: 'Taxes & Income',
    emoji: '🧾',
    color: '#0891b2',
    gradient: 'linear-gradient(135deg,#0891b2,#06b6d4)',
    tag: 'Essential',
    description: 'Demystify how income taxes work, what you owe, and how to legally keep more of what you earn.',
    lessons: [
      {
        title: 'How Income Tax Works',
        info: [
          'The US uses a progressive (marginal) tax system — you don\'t pay your top rate on all income. The first $11,600 (2024, single filer) is taxed at 10%, the next chunk at 12%, then 22%, and so on. Your "marginal rate" is only applied to dollars within that bracket, not your entire income.',
          'Your effective tax rate is your actual average: total taxes paid divided by total income. Someone earning $80,000 might be in the "22% bracket" but only pay an effective rate of ~14–15% because most of their income is taxed at lower rates.',
          'The standard deduction ($14,600 for single filers in 2024) reduces your taxable income automatically without itemizing. Most people take it. Itemizing (listing mortgage interest, charitable donations, state taxes) only makes sense if your total deductions exceed the standard amount.',
          'FICA taxes (Social Security + Medicare) are separate from income tax and fund those specific programs. Employees pay 7.65% and employers match it. Self-employed people pay the full 15.3% "self-employment tax" themselves, making self-employment costs significantly higher than they appear.',
          'W-2 employees have taxes withheld automatically from each paycheck based on their W-4 form. The W-4 tells your employer how much to withhold. Filing your annual return (by April 15) reconciles what was withheld vs. what you actually owed — producing a refund or a bill.',
          '1099 income (freelance, contract, side gigs) has no withholding — it\'s your responsibility to pay quarterly estimated taxes to the IRS. Failing to do so results in underpayment penalties. Self-employed individuals should set aside 25–30% of gross income for taxes.',
          'Tax deductions reduce taxable income (saving you your marginal rate × the deduction amount). Tax credits reduce your tax bill dollar-for-dollar and are more powerful. A $1,000 deduction saves $220 for someone in the 22% bracket; a $1,000 credit saves $1,000 flat.'
        ],
        quiz: [
          { q: 'In a marginal tax system, your top rate applies to:', choices: ['Only the dollars that fall within that specific tax bracket', 'Your entire annual income from all sources combined', 'Gross income before any deductions are subtracted', 'The average of your three highest-earning months'], a: 0 },
          { q: 'Your "effective tax rate" means:', choices: ['Total taxes paid divided by total gross income earned', 'The highest tax bracket your income reaches this year', 'The rate applied to your last dollar of earned income', 'Your state tax rate added to your federal bracket rate'], a: 0 },
          { q: 'The standard deduction is valuable because:', choices: ['It reduces taxable income without requiring itemized records', 'It is a direct credit reducing your final tax bill owed', 'It eliminates FICA taxes for lower-income earners entirely', 'It is only available to homeowners with a mortgage interest'], a: 0 },
          { q: 'Self-employed people pay more in FICA because:', choices: ['They cover both the employee and employer portions (15.3%)', 'Self-employment income is taxed at a special premium rate', 'They are not eligible for the standard deduction benefits', 'The IRS charges a self-employment surcharge above regular taxes'], a: 0 },
          { q: 'If you receive 1099 income, you are responsible for:', choices: ['Paying quarterly estimated taxes to the IRS yourself', 'Filing only at year-end since no withholding is required', 'Paying taxes only if total 1099 income exceeds $50,000', 'Nothing extra — it is taxed identically to W-2 income'], a: 0 },
          { q: 'A tax credit is more valuable than a deduction of the same size because:', choices: ['Credits reduce your tax bill dollar-for-dollar, not just by your rate', 'Credits apply to FICA taxes while deductions only reduce income tax', 'Credits are refundable but deductions can never generate a refund', 'The IRS automatically doubles credits for lower-income filers'], a: 0 },
          { q: 'The purpose of a W-4 form is to:', choices: ['Tell your employer how much federal income tax to withhold', 'Report freelance income you earned outside your main job', 'Claim your annual deductions directly with the IRS online', 'Apply for a tax refund on income withheld the prior year'], a: 0 },
          { q: 'Someone in the 22% bracket with $70,000 income pays 22% on:', choices: ['Only the slice of income that falls within the 22% bracket range', 'All $70,000 of their gross annual income from every source', 'Their gross income minus only the standard deduction amount', 'The first $70,000 after their FICA taxes have been removed'], a: 0 },
          { q: 'An independent contractor should set aside what percentage for taxes?', choices: ['25–30% to cover federal income tax plus self-employment tax', '10–15%, matching a typical W-2 employee\'s withholding rate', 'Nothing until April — taxes are only due once per year', 'Exactly 22% if their income puts them in that bracket range'], a: 0 }
        ]
      },
      {
        title: 'Tax-Advantaged Accounts',
        info: [
          'A 401(k) is an employer-sponsored retirement account funded with pre-tax dollars. Contributions reduce your taxable income today, and the money grows tax-deferred — you pay income tax only when you withdraw in retirement. The 2024 contribution limit is $23,000.',
          'Employer matching is the single best return available in personal finance: if your employer matches 50% of contributions up to 6% of salary, and you earn $60,000, contributing $3,600 earns you $1,800 free — a guaranteed 50% instant return. Never leave a match on the table.',
          'A Traditional IRA lets you contribute up to $7,000/year (2024) with potential tax-deductibility. A Roth IRA uses after-tax dollars, but all growth and withdrawals are tax-free in retirement. The Roth is generally superior for younger, lower-income earners who expect to be in a higher bracket later.',
          'The Roth conversion ladder is an advanced strategy for early retirees: converting Traditional IRA funds to Roth over several low-income years, paying tax at a low rate now, and accessing the funds tax-free later. It requires 5-year aging periods for each conversion.',
          'An HSA (Health Savings Account) is the only triple-tax-advantaged account available: contributions are pre-tax, growth is tax-free, and withdrawals for qualified medical expenses are tax-free. After 65, you can withdraw for any reason (paying ordinary income tax, like a traditional IRA). It\'s often called a "stealth IRA."',
          'The backdoor Roth IRA is a legal workaround for high earners who exceed the Roth income limit ($161,000 single in 2024): contribute to a non-deductible Traditional IRA, then convert it to Roth. The conversion is tax-free because no deduction was taken initially.',
          '529 college savings plans grow tax-free for qualified education expenses (tuition, room, board, books). Unused funds can now be rolled into a Roth IRA (up to $35,000 lifetime) under SECURE 2.0. Contributions are not federally deductible but many states offer a state tax deduction.'
        ],
        quiz: [
          { q: 'A 401(k) contribution reduces your taxes because:', choices: ['Pre-tax contributions lower your taxable income in the current year', 'The IRS refunds 50% of all contributions made to the account', 'Growth is untaxed even when you withdraw the money at retirement', 'Employer matches are classified as tax credits on your return'], a: 0 },
          { q: 'Employer 401(k) matching should be treated as:', choices: ['Free money — always contribute enough to capture the full match', 'Optional — only worth doing if you\'re in a high tax bracket', 'Less important than paying off any debt before contributing', 'Taxable income that significantly reduces the value of matching'], a: 0 },
          { q: 'A Roth IRA is generally better than a Traditional IRA for:', choices: ['Younger earners in lower brackets who expect higher rates later', 'High earners at peak income who want the deduction today', 'People who need to access contributions before age 59½', 'Anyone over 50 making catch-up contributions to retirement'], a: 0 },
          { q: 'An HSA is called "triple tax-advantaged" because:', choices: ['Contributions, growth, and qualified withdrawals are all tax-free', 'It provides three separate annual contribution limit windows', 'It covers three categories: medical, dental, and vision expenses', 'Three family members can each contribute the maximum yearly'], a: 0 },
          { q: 'The backdoor Roth IRA strategy exists because:', choices: ['High earners above the income limit can still access Roth benefits', 'Standard Roth accounts have contribution limits that are too low', 'Traditional IRA conversions generate a tax-free income event', 'It avoids the 10% early withdrawal penalty before age 59½'], a: 0 },
          { q: 'A 529 plan is specifically designed for:', choices: ['Tax-free growth for qualified education expenses', 'Retirement savings as a supplement to a 401(k) contribution', 'Healthcare expenses as an alternative to an HSA account', 'Short-term savings goals with a state tax deduction benefit'], a: 0 },
          { q: 'The 2024 annual Roth IRA contribution limit for under-50s is:', choices: ['$7,000 per year per individual account holder', '$23,000 matching the 401(k) contribution limit amount', '$14,000 for couples filing jointly on one shared account', '$3,500 as Roth limits are half of Traditional IRA limits'], a: 0 },
          { q: 'After age 65, an HSA can be used for non-medical expenses by:', choices: ['Paying ordinary income tax on the withdrawal, like a Traditional IRA', 'Taking a 20% penalty plus income tax like before retirement age', 'Withdrawing completely tax-free with no conditions or penalties', 'Only converting it to a Roth IRA through a one-time transfer'], a: 0 },
          { q: 'The Roth conversion ladder is primarily useful for:', choices: ['Early retirees converting funds during low-income years at low rates', 'High earners trying to exceed the annual contribution limits', 'People who want to access Social Security benefits early', 'Anyone who has a 401(k) and wants to eliminate it entirely'], a: 0 }
        ]
      }
    ]
  },
  {
    id: 5,
    title: 'Debt & Repayment Strategy',
    emoji: '🔓',
    color: '#dc2626',
    gradient: 'linear-gradient(135deg,#dc2626,#f97316)',
    tag: 'Freedom',
    description: 'Learn systematic strategies to eliminate debt efficiently and understand when debt is a tool vs. a trap.',
    lessons: [
      {
        title: 'Good Debt vs. Bad Debt',
        info: [
          'Not all debt is equally harmful. "Good debt" typically has a low interest rate and funds something that grows in value or increases your earning power — a mortgage on an appreciating home, or a student loan that leads to a significantly higher salary.',
          'Bad debt funds depreciating assets or consumption at high interest rates. Credit card debt averaging 24% APR is almost always destructive. A car loan at 8% for a vehicle losing 15% of value per year is a wealth drain. Consumer debt on lifestyle purchases rarely has a positive ROI.',
          'The true cost of carrying debt is calculated through the Annual Percentage Rate (APR). A $5,000 credit card balance at 24% APR, making only minimum payments, takes over 15 years to pay off and costs more than $7,000 in interest — paying more interest than original principal.',
          'Student loans occupy a gray area: federal loans at 5–7% with income-driven repayment options, deferment, and potential forgiveness are fundamentally different from private student loans at 10–14% with no protections. The degree\'s earning premium vs. total debt load is the key calculation.',
          'Debt-to-income ratio (DTI) measures your monthly debt payments against gross monthly income. Lenders consider under 36% healthy; over 43% typically prevents mortgage qualification. Your DTI affects both loan availability and the interest rate you\'re offered.',
          'Secured debt (backed by collateral: mortgages, auto loans) carries lower interest rates because lenders can repossess the asset. Unsecured debt (credit cards, personal loans, medical debt) has no collateral, so lenders charge higher rates to compensate for the risk.',
          'Credit card minimum payments are mathematically designed to maximize bank profits. Minimums are typically 1–2% of balance — just enough to prevent default but not enough to make meaningful progress. Paying only the minimum on a $3,000 balance at 22% takes over 10 years to clear.'
        ],
        quiz: [
          { q: '"Good debt" is generally characterized by:', choices: ['Low interest rates that fund appreciating assets or earning power', 'Any debt taken on by someone with a strong credit score', 'Debt that requires only minimum monthly payments to manage', 'Borrowing at any rate as long as the amount is under $10,000'], a: 0 },
          { q: 'A credit card balance at 24% APR is dangerous because:', choices: ['Interest compounds rapidly, and minimum payments barely reduce principal', 'The balance is reported monthly to all three credit bureaus', 'Credit cards cannot be used for purchases over a certain limit', 'Carrying a balance automatically lowers your credit limit over time'], a: 0 },
          { q: 'Debt-to-income ratio (DTI) is important because:', choices: ['Lenders use it to determine loan eligibility and interest rates', 'It determines your federal income tax bracket each year', 'DTI above 10% automatically disqualifies all mortgage applications', 'It is the primary factor used to calculate your credit score'], a: 0 },
          { q: 'Secured debt carries lower interest rates than unsecured debt because:', choices: ['Lenders can repossess the collateral if you default on payments', 'Secured borrowers have better credit scores by definition', 'Government regulations cap interest on all secured loan types', 'The collateral itself earns interest that offsets the lender risk'], a: 0 },
          { q: 'Federal student loans differ from private loans in that they offer:', choices: ['Income-driven repayment, deferment, and potential forgiveness options', 'Guaranteed lower interest rates than any private lender offers', 'No credit check requirement and fixed rates below 2% annually', 'Complete tax deductibility of all interest paid regardless of income'], a: 0 },
          { q: 'Paying only the minimum on a credit card primarily benefits:', choices: ['The bank — minimums are designed to maximize total interest paid', 'The borrower by preserving cash flow for other investments', 'The credit score by keeping utilization at an ideal percentage', 'Both parties equally since interest rates are federally regulated'], a: 0 },
          { q: 'A healthy debt-to-income ratio for mortgage qualification is generally:', choices: ['Below 36% of gross monthly income going to all debt payments', 'Below 60%, as anything under this is acceptable to most lenders', 'Exactly 28% going to housing costs and nothing else matters', 'Under $2,000 in total monthly debt payments regardless of income'], a: 0 },
          { q: 'An auto loan at 8% on a car depreciating 15%/year represents:', choices: ['A net annual loss of 23% — bad debt funding a declining asset', 'A net gain since the loan rate is below the depreciation rate', 'Neutral debt since transportation is a necessary living expense', 'Good debt because the vehicle enables income-earning employment'], a: 0 },
          { q: 'The key question when evaluating student loan debt is:', choices: ['Whether the degree\'s earning premium justifies the total loan balance', 'Whether the university is ranked in the top 50 nationally', 'Whether the loan is federal or private based on interest rates alone', 'Whether you can make minimum payments on your expected starting salary'], a: 0 }
        ]
      },
      {
        title: 'Avalanche vs. Snowball Method',
        info: [
          'The Debt Avalanche method targets the highest-interest-rate debt first while paying minimums on all others. Once the highest-rate debt is eliminated, you roll that payment to the next highest. Mathematically, this is the optimal strategy — it minimizes total interest paid.',
          'The Debt Snowball method targets the smallest balance first regardless of interest rate. You pay minimums on everything else and attack the smallest debt. When it\'s gone, that freed payment rolls to the next smallest balance.',
          'The psychological case for Snowball: eliminating entire debts produces measurable dopamine responses and momentum. Behavioral research shows that people who use Snowball actually stick to their plan longer and pay off more total debt, despite paying more interest. For many, motivation > math.',
          'Hybrid approaches work well: use Snowball for your first 1–2 debts to build momentum, then switch to Avalanche once the habit is established. Alternatively, prioritize any debt over 20% APR immediately regardless of balance size.',
          'Debt consolidation combines multiple debts into one loan, ideally at a lower rate. A personal loan at 10% to pay off three credit cards at 22–26% saves substantial interest and simplifies payments. The risk: it only works if you don\'t run the cards back up after consolidating.',
          'Balance transfer cards offer 0% APR promotional periods (typically 12–21 months) with a 3–5% transfer fee. Transferring $5,000 at 0% for 18 months versus 24% APR saves ~$1,100 in interest. The strategy requires paying the balance before the promotional period ends — after which rates typically spike to 25%+.',
          'The debt-free date calculation: take your total balance, estimate monthly payment, and use a debt payoff calculator or the formula: n = -log(1 - (r × P / M)) / log(1 + r), where P is balance, r is monthly rate, M is monthly payment. Knowing your exact payoff date makes the goal concrete and motivating.'
        ],
        quiz: [
          { q: 'The Debt Avalanche method prioritizes debts by:', choices: ['Highest interest rate first to minimize total interest paid', 'Smallest balance first regardless of interest rate', 'Newest debt first because it has the least accumulated interest', 'Largest balance first to reduce the principal outstanding quickly'], a: 0 },
          { q: 'The Debt Snowball is psychologically effective because:', choices: ['Eliminating whole debts builds momentum and motivation to continue', 'It always results in paying less total interest than the Avalanche', 'Smaller balances have lower interest rates by definition', 'It requires no tracking — you simply pay the same amount monthly'], a: 0 },
          { q: 'Debt consolidation is most effective when:', choices: ['The new consolidated rate is lower than your current average rate', 'You consolidate and continue using the original credit cards freely', 'Your total balance is under $1,000 and involves only one creditor', 'The consolidation company charges no origination fee at all'], a: 0 },
          { q: 'A balance transfer card with 0% APR for 18 months means:', choices: ['No interest on transferred balances for 18 months, then rates spike', 'The card charges 0% on all new purchases made after transfer', 'You can carry any balance indefinitely without interest charges', 'The bank forgives the balance if not paid within 18 months'], a: 0 },
          { q: 'Mathematically, which method minimizes total interest paid?', choices: ['Debt Avalanche — targeting highest interest rates first always wins', 'Debt Snowball — small balances carry disproportionate interest costs', 'Both methods produce identical total interest over time always', 'Whichever starts with the account that has the oldest open date'], a: 0 },
          { q: 'The primary risk of balance transfer cards is:', choices: ['Paying the full balance before the 0% period ends and rates spike', 'Being charged the full 18 months of interest upfront as a fee', 'Damaging your credit score by more than 50 points immediately', 'The transfer fee always exceeds the interest savings from 0% APR'], a: 0 },
          { q: 'Rolling a freed payment to the next debt target is called:', choices: ['The payment rollover — it\'s central to both Snowball and Avalanche', 'Debt stacking — a legally restricted practice in some states', 'Double dipping — frowned upon by most financial advisors', 'Minimum shifting — only applicable to credit card debt types'], a: 0 },
          { q: 'A hybrid approach to debt repayment might involve:', choices: ['Starting with Snowball for momentum, then switching to Avalanche', 'Using only Avalanche on weekdays and Snowball on weekends', 'Paying random debts each month based on how you\'re feeling', 'Combining Snowball and ignoring any debt above 15% APR'], a: 0 },
          { q: 'Debt consolidation via personal loan only works long-term if:', choices: ['You don\'t reaccumulate debt on the cards you paid off', 'The loan term is under 12 months regardless of balance size', 'Your credit score exceeds 750 to qualify for the lowest rates', 'You take the maximum loan amount available to build a buffer'], a: 0 }
        ]
      }
    ]
  },
  {
    id: 1,
    title: 'Saving & Planning',
    emoji: '💰',
    color: '#059669',
    gradient: 'linear-gradient(135deg,#059669,#10b981)',
    tag: 'Professional',
    description: 'Learn to build safety nets and leverage the exponential power of financial planning and compound interest.',
    lessons: [
      {
        title: 'Emergency Fund',
        info: [
          'An emergency fund is a liquid, accessible cash reserve reserved strictly for genuine financial emergencies: unexpected medical costs, sudden job loss, major car or home repairs. It is not a vacation fund or a spending buffer.',
          'The standard recommendation is 3–6 months of essential living expenses — not income. Calculate your actual monthly necessities (rent, food, utilities, minimum debt payments, insurance) and multiply by your target month count based on job security and dependents.',
          'Where you keep it matters: a high-yield savings account (HYSA) is ideal — FDIC-insured, earning 4–5% APY (as of 2024), immediately accessible, and separated from your checking account to reduce temptation. Avoid investing your emergency fund in stocks, which can drop 30%+ right when you need the money.',
          'Building it in stages reduces overwhelm. Start with a $500–$1,000 "starter" emergency fund to cover minor crises, then focus on eliminating high-interest debt, then return to building the full 3–6 month fund.',
          'If you have highly variable income (freelance, commission, seasonal work) or dependents, target the higher end: 6–9 months. Dual-income households with stable jobs can function safely with 3 months.',
          'A fully-funded emergency fund has a measurable ROI: avoiding a single high-interest cash advance ($500 at 36% APR) over 6 months saves $90 — equivalent to earning 36% on that $500. The "return" is the debt you never have to take on.',
          'The fund should only be replenished after use — treat emergency fund withdrawals like any debt and rebuild the balance as quickly as possible before resuming other savings goals.'
        ],
        quiz: [
          { q: 'An emergency fund should be sized based on:', choices: ['3–6 months of essential living expenses (not gross monthly income)', 'Exactly one month of your gross salary before any taxes are removed', 'Whatever amount makes you feel most comfortable in your own mind today', 'Your total annual income divided by the 12 months of the calendar year'], a: 0 },
          { q: 'Why is an HYSA the preferred home for an emergency fund?', choices: ['It is insured, earns interest, and stays accessible for you to use', 'It earns the highest possible returns of any financial investment account', 'It prevents you from accessing the money in true medical emergencies', 'Banks offer large tax deductions for all your monthly HYSA contributions'], a: 0 },
          { q: 'Which of the following is an appropriate use of this fund?', choices: ['Covering three months of rent after an unexpected job loss occurs', 'Funding a family vacation because the flights are unusually cheap today', 'Buying a discounted 4K TV during a major holiday or Black Friday sale', 'Paying for a friend\'s wedding gift that you cannot currently afford now'], a: 0 },
          { q: 'A freelancer with variable monthly income should target:', choices: ['The higher end (6–9 months) due to income unpredictability issues', 'The standard 1-month fund is sufficient for any person with a job', 'No emergency fund is needed since they can always find more work fast', 'Exactly 3 months regardless of their specific monthly income type'], a: 0 },
          { q: 'Why should emergency fund money NOT be invested in stocks?', choices: ['Markets can decline 30% right when an emergency hits your family', 'Stocks are illegal to use for any emergency cash withdrawal purposes', 'Investment accounts take over five years to open at a traditional bank', 'Stock investments are only for retirement and high-end 401k accounts'], a: 0 },
          { q: 'The "staged" approach to building an emergency fund is:', choices: ['Start with $1k, pay debt, then finish the full 3–6 month fund', 'Save the full amount before paying any other monthly bills or costs', 'Skip the fund until every debt is completely paid off by the end', 'Save 50% of income exclusively until the fund is completely full'], a: 0 },
          { q: 'After using your emergency fund, the financially responsible next step is:', choices: ['Rebuild the fund quickly before resuming other financial goals', 'Accept a lower balance and focus on your stock market investments', 'Take out a loan to replenish it faster while continuing other goals', 'Wait until the end of the year to decide if you need to replenish it'], a: 0 },
          { q: 'The "ROI" of an emergency fund is best understood as:', choices: ['The high-cost debt and fees you avoid by having cash in a crisis', 'The interest rate your HYSA account earns (typically 4–5% APY)', 'The tax deduction available on your yearly personal contributions', 'The credit score boost from having a large savings account balance'], a: 0 },
          { q: 'A dual-income household with stable jobs can target:', choices: ['The lower end (3 months) since two stable incomes reduce total risk', 'The maximum range of 12 months due to general economic shifts', 'No emergency fund since dual income provides complete security', 'An exact dollar amount of $10,000 regardless of their expenses'], a: 0 }
        ]
      },
      {
        title: 'Budgeting Tools & Methods',
        info: [
          'The 50/30/20 rule is a percentage-based framework: 50% of after-tax income to needs (housing, utilities, groceries, minimum debt payments), 30% to wants (dining, entertainment, travel), 20% to savings and extra debt paydown. It\'s a starting point, not a rigid law.',
          'Zero-based budgeting (ZBB) requires assigning every dollar a category until income minus all allocations equals zero. It\'s more labor-intensive but produces dramatically greater awareness and control — popular with people who have variable expenses or a history of overspending.',
          'The envelope method (digital or physical) assigns cash to spending categories at the start of the month. When an envelope is empty, that category is done. The physical limitation makes it psychologically harder to overspend than a credit card.',
          'Budgeting apps like YNAB (You Need A Budget), Copilot, and Monarch Money connect to accounts and categorize transactions automatically. They reduce friction enormously but still require weekly review — automation isn\'t a substitute for engagement.',
          'The biggest budgeting mistake is treating it as a one-time setup rather than a living system. Income changes, subscriptions renew, and irregular expenses like car maintenance must be revisited monthly. Most people who "fail" at budgeting actually just failed to iterate.',
          'Anti-budget or "Pay Yourself First" budgeting: save and invest first, pay fixed bills second, spend the remainder however you want without tracking. It\'s effective for people who hate detailed tracking but requires disciplined savings automation upfront.',
          'Net worth tracking is the complement to budgeting — while budgets track monthly cash flow, net worth (assets minus liabilities) tracks the cumulative result. Checking it quarterly shows whether your budgeting habits are actually building wealth over time.'
        ],
        quiz: [
          { q: 'In the 50/30/20 framework, "needs" are defined as:', choices: ['Essentials required for functioning — housing, groceries, and debt', 'Anything you purchase more than once per month for your home', 'All expenses that bring you long-term happiness and satisfaction', 'Expenses that fall under a certain specific dollar threshold amount'], a: 0 },
          { q: 'Zero-based budgeting differs from 50/30/20 primarily because:', choices: ['ZBB requires assigning every specific dollar to a named category', 'ZBB is only for people who have zero total savings in the bank', 'ZBB requires no tracking of your monthly spending habits at all', 'Zero-based means you save exactly zero dollars every single month'], a: 0 },
          { q: 'The envelope budgeting method is effective because:', choices: ['Physical cash makes overspending more tangible and harder to ignore', 'Envelopes earn interest that digital bank accounts do not provide', 'It requires formal bank approval before you can spend any money', 'It eliminates the need to think about your spending during the month'], a: 0 },
          { q: 'The "anti-budget" or Pay Yourself First approach is best for:', choices: ['People who hate tracking but can automate savings and investing', 'People with no income who need to track every single cent carefully', 'Anyone with high-interest debt that needs active daily management', 'Beginners who have never tracked any of their expenses ever before'], a: 0 },
          { q: 'Why do most people "fail" at budgeting according to experts?', choices: ['They treat it as a one-time setup rather than a living system', 'Budgeting is fundamentally too complex for most people to learn', 'They track too many categories and become quickly overwhelmed', 'They do not use the right expensive application or software tool'], a: 0 },
          { q: 'Net worth is calculated as:', choices: ['Total assets (what you own) minus total liabilities (what you owe)', 'Monthly income minus your total monthly personal expenses', 'Savings account balance plus your total investment account balance', 'Annual income minus all the annual taxes you paid to the state'], a: 0 },
          { q: 'A budgeting app that auto-categorizes is most useful when:', choices: ['Combined with a regular weekly or monthly personal review process', 'Set up once and then never reviewed again by the user ever again', 'Used without any personal financial awareness of your money habits', 'Shared with your local bank for automatic bill payment schedules'], a: 0 },
          { q: 'If someone earns $4,000/month, how much should go to savings?', choices: ['$800 (which is 20% of the $4,000 total monthly income amount)', '$2,000 (which is 50% of the $4,000 total monthly income amount)', '$1,200 (which is 30% of the $4,000 total monthly income amount)', '$400 (which is 10% of the $4,000 total monthly income amount)'], a: 0 },
          { q: 'Tracking net worth quarterly helps because:', choices: ['It shows if your daily habits are actually building total wealth', 'Net worth tracking is required by federal tax law for all earners', 'It replaces the need for monthly budgeting once you reach a goal', 'It automatically adjusts your budget percentages based on markets'], a: 0 }
        ]
      },
      {
        title: 'The Power of Compound Interest',
        info: [
          'Compound interest means earning returns not just on your original principal, but on all previously accumulated interest. A $10,000 investment at 7% doesn\'t just earn $700/year — by year 10, it\'s earning interest on $17,000+, accelerating exponentially.',
          'The Rule of 72: divide 72 by your annual interest rate to find how many years it takes to double your money. At 7% annual growth, money doubles every ~10 years. At 10%, every 7.2 years. This rule makes compounding\'s power tangible and easy to calculate mentally.',
          'Time is the single most powerful variable in compounding — more powerful than the rate of return or the amount invested. Someone who invests $200/month from age 22–32 (10 years, then stops) will often end up with more at 65 than someone who invests $200/month from age 32–65 (33 years, late start).',
          'Tax-advantaged accounts (401k, IRA, Roth IRA) accelerate compounding by eliminating or deferring taxes on gains. A traditional 401k defers taxes; a Roth IRA grows tax-free forever. Both dramatically outperform taxable accounts over long periods.',
          'Inflation is "reverse compounding" — at 3% annual inflation, $100 today is worth only ~$74 in 10 years. Any money not invested and growing faster than inflation is silently losing purchasing power. Keeping large sums in low-yield savings long-term is a hidden cost.',
          'Dollar-cost averaging (DCA) — investing a fixed amount at regular intervals regardless of market conditions — removes the temptation to "time the market" and ensures you buy more shares when prices are low and fewer when prices are high, lowering your average cost per share over time.',
          'The S&P 500 has returned an average of ~10% per year historically (7% after inflation). This is the basis for long-term financial planning assumptions — not guaranteed, but the most reliable benchmark for broad stock market expectations available.'
        ],
        quiz: [
          { q: 'The Rule of 72 tells you:', choices: ['How many years it takes to double your money at a certain rate', 'The maximum percentage you should put into risky stock options', 'The ideal savings rate as a percentage of your total income', 'The number of months before compound interest begins to apply'], a: 0 },
          { q: 'Why does starting to invest at 22 vs. 32 produce such a difference?', choices: ['Early years generate decades of exponential growth on themselves', 'Younger investors get preferential tax treatment from the IRS now', 'Investment fees are lower for younger account holders in the US', 'Stock markets always perform better for younger investors today'], a: 0 },
          { q: 'Dollar-cost averaging is a strategy where:', choices: ['You invest a fixed amount on a regular schedule for long periods', 'You wait for the market to fall before making any investments', 'You divide your portfolio equally across seventy-two assets', 'You only invest during months when the market is trending up'], a: 0 },
          { q: 'A Roth IRA is advantageous for long-term wealth building because:', choices: ['Contributions grow tax-free and you pay nothing on withdrawals', 'It earns higher interest rates than any other account type today', 'It is insured against stock market losses by the US government', 'Contributions can be deducted from your taxable income each year'], a: 0 },
          { q: 'Inflation acts as "reverse compounding" because:', choices: ['Purchasing power erodes exponentially over a long period of time', 'It causes interest rates on savings accounts to automatically fall', 'It only affects people who do not budget their monthly expenses', 'It increases the nominal dollar amount in your bank account balance'], a: 0 },
          { q: 'At a 7% annual return, $5,000 grows to $10,000 in:', choices: ['About 10 years (using the Rule of 72 formula: 72 divided by 7)', 'About 5 years because 7% times 5 equals a 35% total increase', 'About 14 years because you must account for inflation and fees', 'Exactly 7 years because of one year per each percentage point'], a: 0 },
          { q: 'The historical average annual return of the S&P 500 is:', choices: ['~10% per year, which is used in long-term planning assumptions', '~3–4%, which roughly matches the rate of inflation every year', '~20%, reflecting only the best decades of market performance', '~7%, which already accounts for an inflation adjustment annually'], a: 0 },
          { q: 'Keeping $20,000 in a 0% account for 10 years carries what cost?', choices: ['The opportunity cost of growth and the loss of purchasing power', 'No cost — cash is always safe and loses absolutely nothing ever', 'Only the small risk of physical theft or losing the physical cash', 'A small monthly fee from the bank for holding the excess money'], a: 0 },
          { q: 'Compound interest is different from simple interest because:', choices: ['It earns returns on previously accumulated interest amounts too', 'Simple interest earns more money faster in the early years of use', 'Compound interest only applies to stock accounts, not savings', 'Simple interest is more beneficial for long periods of ten years'], a: 0 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Credit & Smart Borrowing',
    emoji: '💳',
    color: '#ef4444',
    gradient: 'linear-gradient(135deg,#ef4444,#f97316)',
    tag: 'Financial Reputation',
    description: 'Understand how credit scores work and how to use borrowing as a tool rather than a trap.',
    lessons: [
      {
        title: 'Understanding Credit',
        info: [
          'Credit is a formal agreement to borrow money now with a contractual promise to repay it later, typically with interest. It is not free money — every dollar borrowed costs more than a dollar to repay unless the balance is paid in full before the interest period ends.',
          'Credit history is a documented financial reputation built over years. Landlords, employers (in some states), mortgage lenders, auto financiers, and even utilities check credit reports. A poor history can cost you housing, job opportunities, and hundreds of thousands of dollars in excess interest over a lifetime.',
          'There are five distinct types of credit: revolving credit (credit cards, lines of credit), installment loans (mortgages, auto loans, student loans), open accounts (charge cards with no preset limit), secured credit (backed by collateral like a car), and unsecured credit (no collateral, higher interest).',
          'The difference between a credit report and a credit score: your report is the full detailed record of every account, payment, and inquiry (from Equifax, Experian, TransUnion). Your score is a three-digit number calculated from that report. You can have accurate reports but still a poor score — they are not the same thing.',
          'Hard inquiries (when you apply for new credit) temporarily lower your score by 2–5 points and remain on your report for 2 years. Soft inquiries (background checks, pre-approvals, checking your own score) have zero impact on your score.',
          'Credit utilization — the percentage of your available revolving credit you\'re using — accounts for 30% of your FICO score. Using more than 30% of any card\'s limit signals financial stress to lenders. Using under 10% is considered ideal.',
          'Secured credit cards (backed by your own deposit) and credit-builder loans are specifically designed tools for people building credit from zero or repairing damaged credit. They report to credit bureaus and establish a payment history when used responsibly.'
        ],
        quiz: [
          { q: 'What is the key difference between a report and a score?', choices: ['Report is the history; score is a 3-digit number from that data', 'They are two different names for the same document from a bank', 'A score contains much more detailed information than a report', 'Credit reports are monthly; scores are only issued once per year'], a: 0 },
          { q: 'A "hard inquiry" on your credit report occurs when:', choices: ['You apply for a new line of credit and a lender reviews you', 'You check your own credit score on a monitoring app like this', 'A company sends you a pre-approved mail offer for a new card', 'Your existing card issuer reviews your account during an audit'], a: 0 },
          { q: 'Credit utilization ratio is calculated as:', choices: ['Total credit card balances divided by total credit limits used', 'Number of cards owned divided by your annual gross income', 'Total debt divided by your annual salary before taxes are paid', 'Age of oldest account divided by the number of total accounts'], a: 0 },
          { q: 'A secured credit card differs from a regular card because:', choices: ['It requires a cash deposit as collateral for the credit limit', 'It offers much better rewards than standard high-end credit cards', 'It cannot be used at retail stores — only at a local bank ATM', 'It is only available to people with credit scores above 700 now'], a: 0 },
          { q: 'Which organizations check credit history beyond just banks?', choices: ['Landlords, certain employers, and utility companies check reports', 'Only banks and mortgage companies are legally allowed to check', 'Just credit card companies and auto lenders check your history', 'Government agencies and tax authorities exclusively check scores'], a: 0 },
          { q: 'Using 75% of your credit card limit signals:', choices: ['You may be overextended and pose an increased default risk', 'You are an excellent customer deserving of a limit increase now', 'You have strong spending power and should get premium offers', 'You are using credit correctly and maintaining an active card'], a: 0 },
          { q: 'The three major credit bureaus are:', choices: ['Equifax, Experian, and TransUnion independent companies', 'FICO, VantageScore, and Equifax official scoring agencies', 'The Federal Reserve, FDIC, and CFPB government groups', 'Mastercard, Visa, and American Express global card brands'], a: 0 },
          { q: 'A credit-builder loan is designed specifically to:', choices: ['Establish a positive payment record by reporting on-time data', 'Allow people to borrow large sums without a credit check ever', 'Consolidate existing high-interest debt into one lower loan', 'Provide emergency funds to people who cannot get regular loans'], a: 0 },
          { q: 'Why is credit a "tool" rather than free money?', choices: ['Every borrowed dollar must be repaid with interest added to it', 'Because it can only be used for tools and home repairs today', 'Lenders are legally required to use that term in disclosure', 'Because it works best when used for purchases that appreciate'], a: 0 }
        ]
      }
    ]
  }
];

// --- UNDER 14 "MONEY ADVENTURES" DATA (NEW) ---
const elementaryCoursesData = [
  {
    id: 0,
    title: 'The Secret of Money',
    emoji: '🌟',
    color: '#3b82f6',
    gradient: 'linear-gradient(135deg,#3b82f6,#60a5fa)',
    tag: 'Level 1',
    description: 'Learn where money comes from and how to use it to buy things you need!',
    lessons: [
      {
        title: 'Needs vs. Wants',
        info: [
          'A "Need" is something you absolutely must have to live, like healthy food, water, a safe house, and warm clothes.',
          'A "Want" is something that is fun to have but you could live without, like video games, fancy sneakers, or a new toy.',
          'When you have money, you should always pay for your "Needs" first before spending on "Wants."',
          'Sometimes a "Want" can look like a "Need." You need shoes to walk, but you want the expensive brand-name ones!',
          'Thinking twice before buying a "Want" is called smart spending. It helps you keep money for things that really matter.'
        ],
        quiz: [
          { q: 'Which of these is a "Need"?', choices: ['A healthy dinner', 'A new pack of trading cards', 'A trip to the movie theater', 'A chocolate bar'], a: 0 },
          { q: 'If you only have $10, what should you buy first?', choices: ['A pair of socks you need for school', 'A small toy you saw on TV', 'A bag of candy for your friends', 'A poster for your bedroom wall'], a: 0 },
          { q: 'Why is a "Want" different from a "Need"?', choices: ['You can live without a want, but you need a need to stay healthy and safe', 'Wants are always cheaper than needs', 'Needs are only for grown-ups, not kids', 'There is no difference between them'], a: 0 },
          { q: 'You need a backpack for school. The plain one is $15 and the one with a movie character is $35. The extra $20 is for a:', choices: ['Want', 'Need', 'Tax', 'Investment'], a: 0 },
          { q: 'Smart spending means:', choices: ['Paying for needs first and thinking before buying wants', 'Buying everything you see immediately', 'Only spending money on candy', 'Never spending any money at all'], a: 0 }
        ]
      },
      {
        title: 'How to Earn Money',
        info: [
          'Money doesn’t just appear; people earn it by helping others or doing a job.',
          'As a kid, you can earn money through an allowance for doing chores, or by receiving gifts on your birthday.',
          'You can also earn by being an "entrepreneur"—like selling lemonade, washing a car, or helping a neighbor rake leaves.',
          'The harder or better you work, the more people trust you to do a job again!',
          'Earning money feels great because it’s a reward for your time and effort.'
        ],
        quiz: [
          { q: 'What is an "entrepreneur"?', choices: ['Someone who starts a small business, like a lemonade stand', 'A person who only spends money', 'A type of bank account', 'A specialized tool for raking leaves'], a: 0 },
          { q: 'Which is a way a kid might earn money?', choices: ['Helping a neighbor pull weeds in their garden', 'Finding a magic lamp', 'Waiting for it to grow on a tree', 'Just asking the bank for it'], a: 0 },
          { q: 'What is an "allowance"?', choices: ['Money parents might give you for doing regular chores', 'The amount of time you spend playing games', 'A type of tax you pay at the toy store', 'A special ticket for the movies'], a: 0 },
          { q: 'If you want to earn more money, you should:', choices: ['Look for ways to help people and do a great job', 'Complain that you don’t have enough', 'Wait for your birthday to arrive', 'Spend the money you already have'], a: 0 },
          { q: 'Earning money is a reward for your:', choices: ['Time and effort', 'Luck', 'Good looks', 'Favorite color'], a: 0 }
        ]
      }
    ]
  },
  {
    id: 1,
    title: 'The Three Jars',
    emoji: '🏺',
    color: '#10b981',
    gradient: 'linear-gradient(135deg,#10b981,#34d399)',
    tag: 'Level 2',
    description: 'Learn the "Three Jar System" to manage your money like a master.',
    lessons: [
      {
        title: 'Spend, Save, and Give',
        info: [
          'A great way to manage your money is using three jars: one for Spending, one for Saving, and one for Giving.',
          'The Spending Jar is for small things you want right now, like a snack or a small toy.',
          'The Saving Jar is for "Big Goals"—things that cost a lot of money and take time to reach.',
          'The Giving Jar is for helping others, like donating to an animal shelter or buying a gift for someone in need.',
          'When you get money, try to put a little bit into each jar. This makes you a Money Master!'
        ],
        quiz: [
          { q: 'What is the "Saving Jar" for?', choices: ['Big goals that take time to reach', 'Buying candy every single day', 'Putting trash away', 'Paying for your electricity bill'], a: 0 },
          { q: 'If you want to help a local charity, which jar do you use?', choices: ['The Giving Jar', 'The Spending Jar', 'The Saving Jar', 'The Cookie Jar'], a: 0 },
          { q: 'The "Spending Jar" is best for:', choices: ['Small things you want to buy now', 'Your college fund', 'Money you never want to touch', 'Helping a neighbor with a bill'], a: 0 },
          { q: 'Dividing your money into three jars helps you:', choices: ['Be a Money Master and manage your cash well', 'Lose your money faster', 'Keep your room messy', 'Only think about yourself'], a: 0 },
          { q: 'If you get $3, how much should you put in each jar?', choices: ['Put $1 in each to be balanced', 'Put all $3 in spending', 'Give it all away immediately', 'Hide it under your bed'], a: 0 }
        ]
      },
      {
        title: 'Wait for the Great',
        info: [
          'Patience is a "Money Superpower." If you wait and save, you can buy something much better later.',
          'Impulse buying is when you see something and buy it immediately without thinking. This often leads to "Buyer’s Remorse" (feeling sad you spent the money).',
          'Interest is like a "Thank You" payment. If you put money in a bank, the bank pays you a tiny bit extra for keeping it there!',
          'The longer you leave your money in the Saving Jar or a Bank, the more it can grow.',
          'Setting a goal, like a $50 LEGO set, helps you stay excited about saving.'
        ],
        quiz: [
          { q: 'What is "Buyer’s Remorse"?', choices: ['Feeling sad after spending money on something you didn\'t really need', 'A special discount at the store', 'The name of a new video game', 'Winning a prize for saving money'], a: 0 },
          { q: 'What is "Interest"?', choices: ['Extra money the bank pays you for saving with them', 'The cost of a movie ticket', 'A hobby you like to do', 'A fee you pay for being late'], a: 0 },
          { q: 'Why is patience a "Money Superpower"?', choices: ['It helps you save for much bigger and better things', 'It makes you run faster', 'It helps you find money on the ground', 'It means you never have to work'], a: 0 },
          { q: 'If you want a big toy, the best thing to do is:', choices: ['Set a goal and put money in your Saving Jar every week', 'Cry until someone buys it for you', 'Buy five small toys instead', 'Forget about it completely'], a: 0 },
          { q: 'Impulse buying is:', choices: ['Buying something quickly without thinking about it', 'Saving your money for a year', 'Giving money to a friend', 'Earning money from a job'], a: 0 }
        ]
      }
    ]
  },
  {
    id: 2,
    title: 'Trust & Borrowing',
    emoji: '🤝',
    color: '#f59e0b',
    gradient: 'linear-gradient(135deg,#f59e0b,#fbbf24)',
    tag: 'Level 3',
    description: 'Understand trust, borrowing, and why keeping your word is important.',
    lessons: [
      {
        title: 'What is a Loan?',
        info: [
          'Borrowing means taking something that isn’t yours and promising to give it back later.',
          'A "Loan" is when you borrow money. You must always pay it back, usually by a certain date.',
          'Your "Credit" is your reputation. If you always pay people back, you have "Good Credit" and people trust you.',
          'If you borrow $5 from a friend and don\'t pay them back, they probably won\'t lend you money again. That is "Bad Credit."',
          'Grown-ups use credit for big things like houses, but they have to be very careful to pay it back on time.'
        ],
        quiz: [
          { q: 'What does "Borrowing" mean?', choices: ['Taking something and promising to return it', 'Taking something and keeping it forever', 'Finding something on the street', 'Buying something with your own money'], a: 0 },
          { q: 'What is "Credit" for a kid?', choices: ['Your reputation for being trustworthy with money', 'A plastic card that gives free toys', 'The name of a local bank', 'A type of school grade'], a: 0 },
          { q: 'If you have "Good Credit":', choices: ['People trust you because you pay them back', 'You are the richest person in class', 'You never have to pay for anything', 'You have a secret clubhouse'], a: 0 },
          { q: 'If you borrow a book and lose it, you should:', choices: ['Tell the truth and find a way to replace it', 'Hide and hope they forget about it', 'Say you never borrowed it', 'Borrow another book to make them happy'], a: 0 },
          { q: 'Why do people borrow money?', choices: ['To buy something big now and pay for it over time', 'Because they want to lose friends', 'Because money is free', 'To hide it in a jar'], a: 0 }
        ]
      }
    ]
  }
];

const QUESTIONS_PER_QUIZ = 9;

const ensureQuestions = (questions) => {
  const q = [...questions];
  while (q.length < 5 && q.length > 0) q.push(questions[q.length % questions.length]);
  return q;
};

const randomizeQuestion = (question) => {
  const correctText = question.choices[question.a];
  const choices = [...question.choices].sort(() => Math.random() - 0.5);
  const a = choices.indexOf(correctText);
  return { ...question, choices, a };
};

export default function CoursesScreen({ courseProgressMap = {}, setCourseProgressMap, onCourseComplete, username = '', userTier = 'adult' }) {
  const [page, setPage] = useState('list');
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [completedCourseTitle, setCompletedCourseTitle] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  const [localProgressMap, setLocalProgressMap] = useState(() => courseProgressMap || {});
  const [courseCompleteMarked, setCourseCompleteMarked] = useState(false);
  const [storagePref, setStoragePref] = useState(localStorage.getItem('storage_preference'));

  const isElementary = userTier === 'elementary';
  const activeCoursesData = isElementary ? elementaryCoursesData : adultCoursesData;

  useEffect(() => {
    if (courseProgressMap) setLocalProgressMap(prev => ({ ...courseProgressMap, ...prev }));
  }, [courseProgressMap]);

  useEffect(() => {
    if (storagePref === 'supabase') {
      const timer = setTimeout(async () => {
        try {
          const { data: { user } } = await supabase.auth.getUser();
          if (user) await supabase.from('users').update({ courseProgressMap: localProgressMap }).eq('id', user.id);
        } catch (err) { console.error("Sync error:", err); }
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [localProgressMap, storagePref]);

  const effectiveProgressMap = localProgressMap;
  const courseHeading = isElementary ? '🚀 Money Adventures' : 'My Learning';
  const courseSubtitle = isElementary
    ? 'Fun lessons to help you become a Money Master!'
    : 'Gain in-demand financial skills and earn certificates of completion.';

  const course = useMemo(() => activeCoursesData.find((c) => c.id === currentCourseId), [currentCourseId, activeCoursesData]);
  const lesson = course?.lessons?.[currentLesson];

  const courseLessonDone = (courseId, lessonIdx) =>
    Boolean(effectiveProgressMap?.[`course_${courseId}_lesson_${lessonIdx}`]);

  const lessonsCompletedCount = (courseId) => {
    const c = activeCoursesData.find((x) => x.id === courseId);
    if (!c) return 0;
    return c.lessons.reduce((sum, _, idx) => sum + (courseLessonDone(courseId, idx) ? 1 : 0), 0);
  };

  const getCourseProgressPct = (courseId) => {
    const c = activeCoursesData.find((x) => x.id === courseId);
    if (!c) return 0;
    return lessonsCompletedCount(courseId) / c.lessons.length;
  };

  const totalCoursesFinished = activeCoursesData.filter((c) => lessonsCompletedCount(c.id) === c.lessons.length).length;

  const handleStartCourse = (id, isFinished = false) => {
    setCurrentCourseId(id);
    setQuiz(null);
    setResult(null);
    setCourseCompleteMarked(false);
    if (isFinished) {
      setCurrentLesson(0);
      setPage('review');
      return;
    }
    const c = activeCoursesData.find(x => x.id === id);
    let firstIncomplete = 0;
    for (let i = 0; i < c.lessons.length; i++) {
      if (!courseLessonDone(id, i)) { firstIncomplete = i; break; }
    }
    setCurrentLesson(firstIncomplete);
    setPage('course_home'); // Coursera usually starts with a "Course Home"
  };

  const handleBeginQuiz = () => {
    const set = ensureQuestions(lesson.quiz).map(randomizeQuestion);
    setQuiz({ questions: set, index: 0, correct: 0, wrong: [] });
    setResult(null);
    setPage('quiz');
  };

  const handlePickAnswer = (choiceIdx) => {
    if (!quiz || answerFeedback) return;
    const question = quiz.questions[quiz.index];
    const isCorrect = choiceIdx === question.a;
    setAnswerFeedback({
      correct: isCorrect,
      selected: question.choices[choiceIdx],
      correctAnswer: question.choices[question.a]
    });
  };

  const handleNextQuestion = () => {
    if (!answerFeedback) return;
    const isCorrect = answerFeedback.correct;
    const updatedCorrect = quiz.correct + (isCorrect ? 1 : 0);
    const nextIndex = quiz.index + 1;

    if (nextIndex >= quiz.questions.length) {
      const score = Math.round((updatedCorrect / quiz.questions.length) * 100);
      const passed = score >= 70;
      if (passed) {
        const progressKey = `course_${course.id}_lesson_${currentLesson}`;
        const updatedMap = { ...effectiveProgressMap, [progressKey]: 1 };
        setLocalProgressMap(updatedMap);
        setCourseProgressMap?.(progressKey, 1);
        localStorage.setItem('course_progress_backup', JSON.stringify(updatedMap));
      }
      setResult({ score, passed, correct: updatedCorrect, total: quiz.questions.length, wrong: quiz.wrong });
      setQuiz(null);
      setAnswerFeedback(null);
      setPage('result');

      if (passed && currentLesson + 1 >= course.lessons.length) {
        setCourseCompleteMarked(true);
        onCourseComplete?.(course.id);
        setCompletedCourseTitle(course.title);
        setCompletionDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
      }
      return;
    }
    setQuiz({ ...quiz, index: nextIndex, correct: updatedCorrect });
    setAnswerFeedback(null);
  };

  const handleContinueAfterResult = () => {
    if (!result.passed) { handleBeginQuiz(); return; }
    if (currentLesson + 1 < course.lessons.length) {
      setCurrentLesson(currentLesson + 1);
      setPage('lesson');
    } else {
      setPage('certificate');
    }
  };

  // ─── STORAGE PROMPT ───
  if (!storagePref) {
    return (
      <div style={{ ...cStyles.container, display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={cStyles.lessonCard}>
          <h2 style={cStyles.lessonTitle}>Welcome to your Learning Portal</h2>
          <p style={cStyles.lessonInfoText}>Choose how you want to manage your progress data.</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '20px' }}>
            <button onClick={() => { localStorage.setItem('storage_preference', 'supabase'); setStoragePref('supabase'); }} style={{ ...cStyles.quizBtn, background: 'linear-gradient(135deg,#6366f1,#4f46e5)' }}>Synchronize with Account</button>
            <button onClick={() => { localStorage.setItem('storage_preference', 'local'); setStoragePref('local'); }} style={{ ...cStyles.quizBtn, background: '#9ca3af' }}>Store Locally Only</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── LIST VIEW ───
  if (page === 'list') {
    return (
      <div style={{...cStyles.container, background: isElementary ? 'linear-gradient(180deg, #f0f9ff 0%, #ffffff 100%)' : '#fff'}}>
        <div style={cStyles.header}>
          <div>
            <h2 style={cStyles.headerTitle}>{courseHeading}</h2>
            <p style={cStyles.headerSub}>{courseSubtitle}</p>
          </div>
          <div style={{...cStyles.completedPill, background: isElementary ? 'linear-gradient(135deg,#10b981,#059669)' : '#f8fafc', color: isElementary ? '#fff' : '#1e293b', border: isElementary ? 'none' : '1px solid #e2e8f0'}}>
            <span style={{ fontSize: '24px' }}>{isElementary ? '🏆' : '🎓'}</span>
            <div>
              <div style={{ fontWeight: '800', fontSize: '20px' }}>{totalCoursesFinished}/{activeCoursesData.length}</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>Courses Completed</div>
            </div>
          </div>
        </div>

        <div style={cStyles.grid}>
          {activeCoursesData.map((c) => {
            const progressValue = getCourseProgressPct(c.id);
            const lessonsDoneCount = lessonsCompletedCount(c.id);
            const isFinished = lessonsDoneCount === c.lessons.length;
            const hasStarted = lessonsDoneCount > 0 && !isFinished;

            return (
              <div key={c.id} style={{...cStyles.courseCard, borderRadius: isElementary ? '24px' : '8px'}}>
                <div style={{ ...cStyles.courseCardTop, borderTop: `4px solid ${c.color}`, background: '#fff' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '32px' }}>{c.emoji}</span>
                    <span style={{ ...cStyles.courseTierTag, background: c.color + '18', color: c.color }}>{c.tag}</span>
                  </div>
                  <h3 style={cStyles.courseCardTitle}>{c.title}</h3>
                  {!isElementary && <p style={{ color: '#64748b', fontSize: '13px', margin: '8px 0' }}>{c.description}</p>}
                </div>
                <div style={cStyles.courseCardBottom}>
                  <div style={{ marginBottom: '16px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px', fontSize: '12px', color: '#64748b', fontWeight: '600' }}>
                      <span>{lessonsDoneCount}/{c.lessons.length} Modules</span>
                      <span>{Math.round(progressValue * 100)}%</span>
                    </div>
                    <ProgressBar progress={progressValue} />
                  </div>
                  <button
                    onClick={() => handleStartCourse(c.id, isFinished)}
                    style={{
  ...cStyles.startBtn,
  background: isFinished ? '#f0fdf4' : (isElementary ? c.gradient : '#0056D2'),
  color: isFinished ? '#166534' : '#fff',
}}
                  >
                    {isFinished ? 'Review Materials' : hasStarted ? 'Resume Learning' : 'Start Course'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── COURSE HOME (SYLLABUS) ───
  if (page === 'course_home' && course) {
    return (
      <div style={cStyles.innerContainer}>
        <button onClick={() => setPage('list')} style={cStyles.backBtn}>← Back to dashboard</button>
        <div style={{ ...cStyles.syllabusHeader, background: isElementary ? course.gradient : '#fff' }}>
           <span style={{fontSize: '48px'}}>{course.emoji}</span>
           <h1 style={{color: isElementary ? '#fff' : '#1e293b'}}>{course.title}</h1>
           <p style={{color: isElementary ? 'rgba(255,255,255,0.9)' : '#64748b'}}>{course.description}</p>
        </div>
        
        <div style={cStyles.syllabusContainer}>
          <h3 style={{fontSize: '18px', fontWeight: '700', marginBottom: '20px'}}>Course Content</h3>
          {course.lessons.map((les, idx) => {
            const isDone = courseLessonDone(course.id, idx);
            return (
              <div key={idx} style={{...cStyles.syllabusItem, borderLeft: `4px solid ${isDone ? '#22c55e' : course.color}`}}>
                <div style={{flex: 1}}>
                  <div style={{fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700'}}>Module {idx + 1}</div>
                  <div style={{fontWeight: '700', fontSize: '16px'}}>{les.title}</div>
                </div>
                <button 
                  onClick={() => { setCurrentLesson(idx); setPage('lesson'); }}
                  style={{...cStyles.syllabusBtn, background: isDone ? '#f0fdf4' : `linear-gradient(135deg,${course.color},${course.color}cc)`, color: isDone ? '#166534' : '#fff'}}
                >
                  {isDone ? 'Review' : 'Go to Lesson'}
                </button>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── LESSON VIEW (LEARNING ENVIRONMENT) ───
  if (page === 'lesson' && course && lesson) {
    return (
      <div style={cStyles.learningEnv}>
        {/* Sidebar Nav */}
        {!isElementary && (
          <div style={cStyles.sidebar}>
            <div style={{padding: '20px', borderBottom: '1px solid #e2e8f0', fontWeight: '700'}}>Course Modules</div>
            {course.lessons.map((les, idx) => (
              <div 
                key={idx} 
                onClick={() => setCurrentLesson(idx)}
                style={{
                  padding: '15px 20px', 
                  fontSize: '13px', 
                  cursor: 'pointer',
                  borderLeft: currentLesson === idx ? '4px solid #0056D2' : '4px solid transparent',
                  background: currentLesson === idx ? '#f0f7ff' : 'transparent',
                  color: currentLesson === idx ? '#0056D2' : '#475569',
                  fontWeight: currentLesson === idx ? '700' : '500'
                }}
              >
                {courseLessonDone(course.id, idx) ? '✅ ' : ''}{les.title}
              </div>
            ))}
            <div style={{marginTop: 'auto', padding: '20px'}}>
              <button onClick={() => setPage('course_home')} style={{width: '100%', padding: '10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '4px', fontSize: '12px', fontWeight: '600'}}>Close Lesson</button>
            </div>
          </div>
        )}

        <div style={{...cStyles.lessonMainContent, padding: isElementary ? '20px' : '40px 60px'}}>
          {isElementary && <button onClick={() => setPage('course_home')} style={cStyles.backBtn}>← Back to Adventure</button>}
          <div style={{maxWidth: '800px', margin: '0 auto'}}>
            <div style={{display: 'flex', alignItems: 'center', gap: '8px', color: '#64748b', fontSize: '14px', marginBottom: '8px', fontWeight: '600'}}>
               <span>Module {currentLesson + 1}</span>
               <span>•</span>
               <span>Reading Content</span>
            </div>
            <h1 style={{fontSize: '32px', fontWeight: '800', marginBottom: '30px', color: '#1e293b'}}>{lesson.title}</h1>
            
            <div style={cStyles.courseraArticle}>
              {lesson.info.map((line, idx) => (
                <p key={idx} style={{marginBottom: '20px', lineHeight: '1.8', fontSize: '16px', color: '#1f2937'}}>
                  {line}
                </p>
              ))}
            </div>

            <div style={{marginTop: '40px', padding: '28px', background: `linear-gradient(135deg, ${course.color}12, ${course.color}06)`, borderRadius: '16px', border: `1px solid ${course.color}25`}}>
              <h4 style={{margin: '0 0 10px 0'}}>Ready for the module quiz?</h4>
              <p style={{fontSize: '14px', color: '#64748b', marginBottom: '20px'}}>Pass with 70% or higher to complete this module.</p>
              <button onClick={handleBeginQuiz} style={{ ...cStyles.quizBtn, background: `linear-gradient(135deg,${course.color},${course.color}cc)` }}>
                Start Module Quiz
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ─── QUIZ VIEW ───
  if (page === 'quiz' && quiz) {
    const q = quiz.questions[quiz.index];
    return (
      <div style={cStyles.innerContainer}>
        <div style={cStyles.quizHeaderCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontWeight: '700', color: '#64748b' }}>QUESTION {quiz.index + 1} OF {quiz.questions.length}</span>
            <div style={{width: '150px'}}><ProgressBar progress={(quiz.index) / quiz.questions.length} /></div>
          </div>
        </div>
        <div style={{...cStyles.quizCard, border: '1px solid #e2e8f0', boxShadow: 'none'}}>
          <p style={{fontSize: '20px', fontWeight: '600', color: '#1e293b', marginBottom: '24px'}}>{q.q}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {q.choices.map((choice, i) => {
              const isCorrect = i === q.a;
              const isSelectedWrong = answerFeedback && !answerFeedback.correct && answerFeedback.selected === choice;
              return (
                <button 
                  key={i} 
                  onClick={() => handlePickAnswer(i)} 
                  disabled={!!answerFeedback} 
                  style={{
                    ...cStyles.choiceBtn,
                    background: answerFeedback && isCorrect ? '#d1fae5' : (answerFeedback && isSelectedWrong ? '#fee2e2' : '#fff'),
                    borderColor: answerFeedback && isCorrect ? '#22c55e' : (answerFeedback && isSelectedWrong ? '#ef4444' : '#e2e8f0')
                  }}
                >
                  <span style={{...cStyles.choiceLetter, background: answerFeedback && isCorrect ? '#22c55e' : '#fff', color: answerFeedback && isCorrect ? '#fff' : '#1e293b'}}>{String.fromCharCode(65 + i)}</span>
                  {choice}
                </button>
              );
            })}
          </div>
          {answerFeedback && (
            <div style={{ ...cStyles.feedbackBox, background: answerFeedback.correct ? '#f0fdf4' : '#fff1f2', borderColor: answerFeedback.correct ? '#22c55e' : '#f43f5e', borderRadius: '8px' }}>
              <p style={{ fontWeight: '700', margin: '0 0 5px 0', color: answerFeedback.correct ? '#166534' : '#991b1b' }}>
                {answerFeedback.correct ? 'Correct' : 'Incorrect'}
              </p>
              {!answerFeedback.correct && <p style={{fontSize: '14px', margin: 0}}>The correct answer is: <b>{answerFeedback.correctAnswer}</b></p>}
              <button onClick={handleNextQuestion} style={{ ...cStyles.nextBtn, background: '#1e293b', marginTop: '15px' }}>Continue</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── RESULT VIEW ───
  if (page === 'result' && result) {
    return (
      <div style={cStyles.innerContainer}>
        <div style={{ ...cStyles.resultCard, background: '#fff', border: '1px solid #e2e8f0', boxShadow: 'none' }}>
          <div style={{ fontSize: '48px' }}>{result.passed ? '✅' : '❌'}</div>
          <h2 style={{ color: '#1e293b', fontSize: '24px' }}>{result.passed ? 'You passed!' : 'Keep practicing'}</h2>
          <div style={cStyles.scoreDisplay}>
             <div style={{fontSize: '48px', fontWeight: '800'}}>{result.score}%</div>
             <div style={{color: '#64748b'}}>Grade Received</div>
          </div>
          <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '400px', margin: '0 auto 20px' }}>
             {result.passed ? 'Great work! You have successfully completed this module.' : 'You need at least 70% to pass. Review the course material and try again.'}
          </p>
        </div>
        <button onClick={handleContinueAfterResult} style={{ ...cStyles.continueBtn, background: result.passed ? 'linear-gradient(135deg,#6366f1,#4f46e5)' : '#374151' }}>
          {result.passed ? 'Next Module' : 'Retake Quiz'}
        </button>
      </div>
    );
  }

  // ─── CERTIFICATE VIEW ───
  if (page === 'certificate') {
    const certColor = course?.color || '#0056D2';
    return (
      <div style={cStyles.innerContainer}>
        <div style={{
          borderRadius: '8px', padding: '2px',
          background: `linear-gradient(135deg, #6366f1, #818cf8, #6366f1)`,
          boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
        }}>
          <div style={{ background: '#fff', textAlign: 'center', padding: '60px 40px', border: '1px solid #e2e8f0' }}>
            <div style={{ fontSize: '40px', marginBottom: '20px' }}>📜</div>
            <h1 style={{ fontSize: '24px', color: '#1f2937', margin: 0, textTransform: 'uppercase', letterSpacing: '2px' }}>Course Certificate</h1>
            <p style={{ color: '#64748b', fontSize: '14px' }}>This is to certify that</p>
            <h2 style={{ fontSize: '32px', fontStyle: 'serif', margin: '20px 0', borderBottom: '2px solid #e2e8f0', display: 'inline-block', padding: '0 40px' }}>{username || 'Learner'}</h2>
            <p style={{ color: '#64748b', fontSize: '14px' }}>has successfully completed</p>
            <div style={{ fontWeight: '700', fontSize: '20px', color: certColor, margin: '10px 0' }}>{completedCourseTitle}</div>
            <div style={{ marginTop: '40px', display: 'flex', justifyContent: 'center', gap: '40px' }}>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>DATE: {completionDate || new Date().toLocaleDateString()}</div>
                <div style={{ fontSize: '12px', color: '#94a3b8' }}>ID: {Math.random().toString(36).substr(2, 9).toUpperCase()}</div>
            </div>
            <button onClick={() => setPage('list')} style={{ ...cStyles.continueBtn, background: '#1e293b', marginTop: '40px', maxWidth: '300px' }}>Return to Dashboard</button>
          </div>
        </div>
      </div>
    );
  }

  // ─── REVIEW VIEW (UNTOUCHED) ───
  if (page === 'review' && course) {
    return (
      <div style={cStyles.innerContainer}>
        <button onClick={() => setPage('list')} style={cStyles.backBtn}>← Back</button>
        <div style={{ ...cStyles.courseHeaderBar, background: `linear-gradient(135deg, ${course.color}22, ${course.color}08)`, border: `1px solid ${course.color}30` }}>
  <h2 style={{ margin: 0, color: '#1e1b4b', fontSize: '24px' }}>Review: {course.title}</h2>
</div>
        <div style={cStyles.reviewCard}>
          {course.lessons.map((les, idx) => (
            <div key={idx} style={cStyles.reviewItem}>
              <div style={cStyles.reviewLessonTitle}>{les.title}</div>
              <ul style={cStyles.reviewList}>{les.info.map((line, i) => <li key={i} style={cStyles.reviewListItem}>{line}</li>)}</ul>
            </div>
          ))},
          <button onClick={() => setPage('list')} style={{ ...cStyles.continueBtn, marginTop: '40px', maxWidth: '300px' }}>
        </div>
      </div>
    );
  }

  return null;
}

const cStyles = {
  // ── Layout ──────────────────────────────────────────────
  container: {
    padding: '32px 24px 80px',
    maxWidth: '1100px',
    margin: '0 auto',
    fontFamily: "'Inter', -apple-system, sans-serif",
    background: 'transparent',
  },
  innerContainer: {
    maxWidth: '860px',
    margin: '0 auto',
    padding: '32px 20px',
  },

  // ── Header ───────────────────────────────────────────────
  header: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '28px',
    flexWrap: 'wrap',
    gap: '16px',
  },
  headerTitle: {
    margin: 0,
    fontSize: '26px',
    fontWeight: '800',
    color: '#1e1b4b',
  },
  headerSub: {
    margin: '4px 0 0',
    color: '#6b7280',
    fontSize: '14px',
  },
  completedPill: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    borderRadius: '16px',
    padding: '12px 20px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    boxShadow: '0 1px 4px rgba(0,0,0,0.06)',
  },

  // ── Course Grid ──────────────────────────────────────────
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '20px',
  },
  courseCard: {
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden',
    borderRadius: '20px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(99,102,241,0.07)',
    transition: 'transform 0.18s, box-shadow 0.18s',
  },
  courseCardTop: {
    padding: '22px 22px 18px',
    borderBottom: '1px solid #f3f4f6',
  },
  courseCardTitle: {
    margin: '12px 0 4px',
    fontSize: '16px',
    fontWeight: '700',
    color: '#1e1b4b',
    lineHeight: '1.4',
  },
  courseTierTag: {
    fontSize: '10px',
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    padding: '3px 10px',
    borderRadius: '20px',
  },
  courseCardBottom: {
    background: '#fff',
    padding: '18px 22px 22px',
    flex: 1,
  },
  startBtn: {
    width: '100%',
    padding: '11px',
    border: 'none',
    borderRadius: '12px',
    fontWeight: '700',
    fontSize: '14px',
    cursor: 'pointer',
    transition: 'opacity 0.15s',
  },

  // ── Back Button ──────────────────────────────────────────
  backBtn: {
    border: 'none',
    background: 'none',
    color: '#6366f1',
    cursor: 'pointer',
    marginBottom: '20px',
    fontSize: '14px',
    fontWeight: '600',
    padding: '0',
    display: 'flex',
    alignItems: 'center',
    gap: '4px',
  },

  // ── Syllabus ─────────────────────────────────────────────
  syllabusHeader: {
    padding: '36px',
    borderRadius: '20px',
    marginBottom: '24px',
    textAlign: 'center',
  },
  syllabusContainer: {
    background: '#fff',
    padding: '24px',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
  },
  syllabusItem: {
    display: 'flex',
    alignItems: 'center',
    padding: '16px 18px',
    background: '#fafafa',
    border: '1px solid #f0f0f0',
    marginBottom: '10px',
    borderRadius: '12px',
    gap: '12px',
  },
  syllabusBtn: {
    padding: '8px 18px',
    border: 'none',
    borderRadius: '10px',
    fontWeight: '700',
    fontSize: '13px',
    cursor: 'pointer',
    whiteSpace: 'nowrap',
  },

  // ── Learning Environment ─────────────────────────────────
  learningEnv: {
    display: 'flex',
    minHeight: '100vh',
    background: '#f9f9fb',
  },
  sidebar: {
    width: '260px',
    borderRight: '1px solid #e5e7eb',
    background: '#fff',
    display: 'flex',
    flexDirection: 'column',
    position: 'sticky',
    top: 0,
    height: '100vh',
    overflowY: 'auto',
  },
  lessonMainContent: {
    flex: 1,
    overflowY: 'auto',
  },
  courseraArticle: {
    fontFamily: "'Georgia', serif",
  },

  // ── Quiz ─────────────────────────────────────────────────
  quizHeaderCard: {
    padding: '8px 0 16px',
  },
  quizCard: {
    background: '#fff',
    padding: '36px',
    borderRadius: '20px',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(99,102,241,0.06)',
  },
  choiceBtn: {
    width: '100%',
    padding: '14px 18px',
    textAlign: 'left',
    border: '1.5px solid #e5e7eb',
    borderRadius: '12px',
    marginBottom: '10px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '14px',
    fontSize: '15px',
    fontFamily: 'inherit',
    background: '#fff',
    transition: 'border-color 0.15s, background 0.15s',
  },
  choiceLetter: {
    minWidth: '30px',
    height: '30px',
    borderRadius: '50%',
    border: '1.5px solid #d1d5db',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '12px',
    fontWeight: '700',
    background: '#f9fafb',
    color: '#374151',
  },
  feedbackBox: {
    marginTop: '20px',
    padding: '20px',
    borderRadius: '14px',
    border: '1.5px solid',
  },
  nextBtn: {
    padding: '11px 26px',
    border: 'none',
    borderRadius: '10px',
    color: '#fff',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
  },

  // ── Result ───────────────────────────────────────────────
  resultCard: {
    padding: '52px 40px',
    textAlign: 'center',
    marginBottom: '20px',
    borderRadius: '20px',
    background: '#fff',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 12px rgba(99,102,241,0.08)',
  },
  scoreDisplay: {
    margin: '24px 0',
    padding: '20px',
    background: 'linear-gradient(135deg, #f0f0ff, #ede9fe)',
    borderRadius: '14px',
    display: 'inline-block',
    minWidth: '160px',
  },
  continueBtn: {
    width: '100%',
    padding: '15px',
    border: 'none',
    borderRadius: '14px',
    color: '#fff',
    fontWeight: '700',
    fontSize: '15px',
    cursor: 'pointer',
    background: 'linear-gradient(135deg, #6366f1, #4f46e5)',
  },

  // ── Review ───────────────────────────────────────────────
  reviewCard: {
    background: '#fff',
    padding: '30px',
    borderRadius: '16px',
    border: '1px solid #e5e7eb',
  },
  reviewItem: { marginBottom: '30px' },
  reviewLessonTitle: { fontWeight: '800', fontSize: '18px', marginBottom: '15px', color: '#1e1b4b' },
  reviewList: { paddingLeft: '20px' },
  reviewListItem: { marginBottom: '10px', color: '#4b5563', lineHeight: '1.7' },
  courseHeaderBar: { padding: '24px', borderRadius: '16px', marginBottom: '24px' },

  // ── Misc ─────────────────────────────────────────────────
  lessonCard: {
    background: '#fff',
    padding: '40px',
    borderRadius: '20px',
    textAlign: 'center',
    border: '1px solid #e5e7eb',
    boxShadow: '0 2px 8px rgba(99,102,241,0.07)',
  },
  lessonTitle: { fontSize: '22px', fontWeight: '800', marginBottom: '10px', color: '#1e1b4b' },
  lessonInfoText: { color: '#6b7280', lineHeight: '1.6' },
  quizBtn: {
    padding: '12px 28px',
    border: 'none',
    borderRadius: '12px',
    color: '#fff',
    fontWeight: '700',
    cursor: 'pointer',
    fontSize: '14px',
  },
};