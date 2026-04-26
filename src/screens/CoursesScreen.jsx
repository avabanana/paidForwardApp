import React, { useEffect, useMemo, useState } from 'react';
import ProgressBar from '../components/ProgressBar';

const coursesData = [
  {
    id: 0,
    title: 'Earning & Growing Your Money',
    emoji: '🚀',
    color: '#8b5cf6',
    gradient: 'linear-gradient(135deg,#8b5cf6,#6366f1)',
    tag: 'Starter',
    tagColor: '#ede9fe',
    tagText: '#6d28d9',
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
          { q: 'A "zero-based budget" means:', choices: ['Every dollar of income is assigned to a specific category until income minus expenses = 0', 'You spend nothing at all each month', 'You only budget if you have zero savings', 'You start fresh with no savings every January'], a: 0 },
          { q: 'A "sinking fund" is best described as:', choices: ['Money set aside monthly for known future irregular expenses like car registration', 'A savings account that loses value over time', 'An emergency fund for unknown expenses', 'A fund specifically for entertainment and dining'], a: 0 },
          { q: 'If you track your spending and realize you\'ve been overspending on dining, the most effective budget adjustment is:', choices: ['Set a specific dollar cap for dining and meal-prep more often at home', 'Delete the dining category and pretend it doesn\'t exist', 'Earn more money so overspending doesn\'t matter', 'Only eat out on weekends regardless of cost'], a: 0 },
          { q: 'Lifestyle inflation occurs when:', choices: ['Your spending rises proportionally with every income increase, preventing savings growth', 'Prices of goods rise due to broader economic inflation', 'You intentionally upgrade your lifestyle after hitting a savings goal', 'Your fixed expenses grow faster than your variable expenses'], a: 0 },
          { q: '"Paying yourself first" is most effectively done by:', choices: ['Automating a savings transfer on payday before any discretionary spending occurs', 'Putting whatever is left over into savings at month\'s end', 'Manually transferring to savings whenever you remember', 'Setting a savings goal but not moving the money immediately'], a: 0 },
          { q: 'Which of the following is a FIXED expense?', choices: ['Monthly rent or mortgage payment', 'Weekly grocery bill', 'Dining out with friends', 'Gasoline and fuel costs'], a: 0 },
          { q: 'Why should you review your budget every month?', choices: ['Because income, expenses, and priorities change and a static budget quickly becomes inaccurate', 'Because banks require monthly budget submissions', 'So you can spend more freely without guilt each month', 'Monthly review is optional — quarterly is sufficient for most people'], a: 0 },
          { q: 'Someone earns $3,000/month and spends $3,000/month on a variety of categories with nothing left over. According to zero-based budgeting, this person should:', choices: ['Ensure every dollar is intentionally assigned — including a savings category — not just accidentally spent', 'Continue their current approach since $3,000 = $3,000', 'Earn more money before worrying about budgeting', 'Focus only on reducing their largest single expense'], a: 0 },
          { q: 'Variable expenses are:', choices: ['Costs that change month-to-month and are often easier to reduce than fixed costs', 'Expenses that never change regardless of behavior', 'Only relevant for people with irregular income', 'Always lower than fixed expenses in a healthy budget'], a: 0 }
        ]
      },
      {
        title: 'Grow With Goals',
        info: [
          'Financial goals require specificity to succeed. "I want to save more" is not a goal — "I will save $2,400 in 12 months by transferring $200 on the 1st of every month" is actionable and measurable.',
          'SMART goals (Specific, Measurable, Achievable, Relevant, Time-bound) are the standard framework because vague intentions produce vague results. Every financial goal should pass all five criteria.',
          'Short-term goals (under 1 year) include emergency funds, vacation savings, and tech purchases. Medium-term (1–5 years) cover a car down payment or moving expenses. Long-term (5+ years) involve home ownership, higher education, or retirement.',
          'Goal prioritization matters: financial experts generally recommend building a starter emergency fund first, then tackling high-interest debt, then saving for other goals simultaneously. Doing everything at once often means accomplishing nothing.',
          'Automated contributions remove willpower from the equation. Direct deposit splits, automatic transfers, and round-up savings apps make goal-funding nearly effortless and remove the temptation to spend first.',
          'Progress checkpoints — weekly spending reviews or monthly savings tallies — dramatically increase follow-through. Behavioral research shows that simply measuring a goal increases the likelihood of achieving it by over 40%.',
          'When you hit a goal, celebrate intentionally but don\'t abandon the system. Immediately redirect the freed-up cash flow to the next priority goal rather than letting it dissolve into lifestyle spending.'
        ],
        quiz: [
          { q: 'Which of these is a properly-formed SMART financial goal?', choices: ['"Save $1,800 for an emergency fund by December 31 by depositing $150 per month"', '"Save more money starting soon"', '"Be better with money this year"', '"Try to spend less on things I don\'t need"'], a: 0 },
          { q: 'According to most financial experts, the generally recommended order of financial priorities is:', choices: ['Starter emergency fund → pay high-interest debt → build full emergency fund → invest/save for other goals', 'Invest first, then save, then pay debt when you have extra', 'Pay off all debt before saving any money at all', 'Save for retirement first, ignore emergency fund until debt is clear'], a: 0 },
          { q: 'Why does automating savings contributions outperform manual transfers?', choices: ['It removes reliance on willpower and prevents spending the money before you save it', 'Automated transfers earn higher interest rates', 'Banks charge lower fees for automated systems', 'It\'s the only method banks allow for savings accounts'], a: 0 },
          { q: 'Saving for a car down payment in 3 years is best classified as:', choices: ['A medium-term financial goal (1–5 years)', 'A short-term goal since it\'s under 5 years', 'A long-term goal because it involves a large amount', 'An emergency goal because cars are necessary for work'], a: 0 },
          { q: 'After achieving a major savings goal, the most financially sound next step is:', choices: ['Immediately redirect the monthly savings amount toward the next priority goal', 'Spend the saved funds as a reward for good behavior', 'Stop saving temporarily and enjoy increased spending', 'Keep saving into the same account indefinitely without a new target'], a: 0 },
          { q: 'Behavioral research on goal-setting suggests that:', choices: ['Measuring and tracking progress toward a goal significantly increases the probability of achieving it', 'Writing goals down has no proven effect on outcomes', 'Only large financial goals are worth tracking formally', 'Goals should be kept private to avoid external pressure'], a: 0 },
          { q: 'A person wants to retire comfortably. This is best described as which type of goal?', choices: ['Long-term, requiring decades of consistent contributions and investment growth', 'Medium-term, achievable within 3–5 years with aggressive saving', 'Short-term if you start early enough in your 20s', 'An aspirational wish rather than a plannable financial goal'], a: 0 },
          { q: 'The primary reason financial goals should be time-bound is:', choices: ['Deadlines create urgency and allow you to calculate the exact monthly contribution needed', 'Banks require a timeline before opening savings accounts', 'Time limits prevent you from saving too much', 'Goals without deadlines are not legally enforceable'], a: 0 },
          { q: 'Why is "save more money" considered a poor financial goal?', choices: ['It lacks specificity, a dollar amount, and a deadline — making it impossible to measure or act on', 'It is too ambitious for most people to achieve', 'Saving more money is actually not a recommended financial strategy', 'It doesn\'t account for inflation over time'], a: 0 }
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
          { q: 'Using the "cost-per-use" framework, which is the smarter purchase?', choices: ['A $240 pair of shoes worn 120 times ($2/wear) vs. a $60 pair worn 10 times ($6/wear)', 'Always the cheaper upfront price regardless of durability', 'The item with the highest brand recognition', 'Whichever item is currently on sale'], a: 0 },
          { q: 'Why is the 24-hour waiting rule effective against impulse purchases?', choices: ['Desire for non-essential items tends to decrease significantly after a time delay, reducing emotionally-driven spending', 'It gives you time to earn more money before buying', 'Stores are more likely to have sales the next day', 'It is a legally required waiting period for purchases over $50'], a: 0 },
          { q: 'A "subscription audit" is valuable primarily because:', choices: ['Recurring monthly charges are psychologically invisible and households often pay for forgotten or unused services', 'It helps you find subscriptions to add for better value', 'Banks require annual subscription reviews', 'Subscriptions are always more expensive than one-time purchases'], a: 0 },
          { q: 'Opportunity cost in spending decisions refers to:', choices: ['The value of what you give up when choosing to spend money one way instead of another (e.g., savings growth)', 'The original price before a discount is applied', 'The cost of returning a purchase you regret', 'Taxes paid on purchases over a certain amount'], a: 0 },
          { q: 'Which of the following is most accurately classified as a "want" rather than a "need"?', choices: ['A $100/month gym membership when you have free outdoor workout options', 'Groceries for cooking meals at home', 'Prescription medication for a chronic condition', 'Electricity for heating your home in winter'], a: 0 },
          { q: 'Price anchoring is a retail tactic where:', choices: ['An inflated "original" price makes the sale price feel like a bargain even if it isn\'t genuinely discounted', 'Prices are anchored to inflation rates and adjusted monthly', 'Stores charge different prices in different geographic regions', 'Premium brands charge more to signal higher quality'], a: 0 },
          { q: 'Calculating "unit price" (cost per ounce, serving, etc.) helps you:', choices: ['Compare true value across different package sizes and brands, often revealing bulk isn\'t always cheaper', 'Determine the exact nutritional content of food', 'Calculate sales tax before checkout', 'Find out which store has the best loyalty program'], a: 0 },
          { q: 'A person impulsively buys a $400 item on a credit card they cannot immediately pay off. The true cost of this purchase is:', choices: ['$400 plus interest charges that accrue until the balance is fully paid — potentially hundreds more', 'Exactly $400 regardless of payment method', '$400 minus any rewards points earned on the purchase', '$400 but offset by any enjoyment derived from the item'], a: 0 },
          { q: 'The most dangerous aspect of lifestyle inflation for long-term wealth building is:', choices: ['It silently consumes income increases, preventing savings from growing even as earnings rise', 'It only affects high-income earners', 'It causes immediate financial crisis and is easily noticed', 'It primarily impacts retirement accounts rather than everyday savings'], a: 0 }
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
    tag: 'Planner',
    tagColor: '#d1fae5',
    tagText: '#065f46',
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
          { q: 'An emergency fund should be sized based on:', choices: ['3–6 months of essential living expenses (not gross income) adjusted for job stability and dependents', 'Exactly one month of your gross salary', 'Whatever amount makes you feel comfortable emotionally', 'Your total annual income divided by 12'], a: 0 },
          { q: 'Why is a high-yield savings account (HYSA) the preferred home for an emergency fund?', choices: ['It is FDIC-insured, earns meaningful interest, and stays accessible without the volatility risk of investments', 'It earns the highest possible returns of any financial account', 'It prevents you from accessing the money in true emergencies', 'Banks offer tax deductions for HYSA contributions'], a: 0 },
          { q: 'Which of the following is an appropriate use of an emergency fund?', choices: ['Covering three months of rent after unexpected job loss', 'Funding a vacation because flights are unusually cheap', 'Buying a discounted TV during a Black Friday sale', 'Paying for a friend\'s wedding gift you can\'t afford'], a: 0 },
          { q: 'A freelancer with variable monthly income should target what size emergency fund?', choices: ['The higher end — 6–9 months of expenses — due to income unpredictability', 'The standard 1-month fund is sufficient for anyone', 'No emergency fund is needed since freelancers can always find more work', 'Exactly 3 months regardless of income type'], a: 0 },
          { q: 'Why should emergency fund money NOT be invested in stocks?', choices: ['Stock markets can decline 30–50% right when an emergency hits, leaving you with far less than you deposited', 'Stocks are illegal to use for emergency purposes', 'Investment accounts take 5+ years to open', 'Stock investments are only for retirement accounts'], a: 0 },
          { q: 'The "staged" approach to building an emergency fund recommends:', choices: ['Start with $500–$1,000 to cover minor crises, tackle high-interest debt, then complete the full 3–6 month fund', 'Save the full amount before paying any other bills', 'Skip the emergency fund until all debt is completely paid off', 'Save 50% of income exclusively until the fund is full'], a: 0 },
          { q: 'After using your emergency fund for a genuine emergency, the financially responsible next step is:', choices: ['Rebuild the fund as quickly as possible before resuming other savings goals', 'Accept a lower balance going forward and focus on investments', 'Take out a loan to replenish it faster while continuing other goals', 'Wait until year-end to decide if replenishment is necessary'], a: 0 },
          { q: 'The "ROI" of an emergency fund is best understood as:', choices: ['The high-cost debt and fees you avoid by not needing payday loans or credit card cash advances in a crisis', 'The interest rate your HYSA earns (typically 4–5%)', 'The tax deduction available on emergency fund contributions', 'The credit score boost from having a large savings balance'], a: 0 },
          { q: 'A dual-income household with stable employment and no dependents can reasonably target:', choices: ['The lower end of the range — 3 months — since two stable incomes reduce the risk of complete income loss', 'The maximum range of 12 months due to economic uncertainty', 'No emergency fund since dual income provides sufficient security', 'An exact dollar amount of $10,000 regardless of expenses'], a: 0 }
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
          { q: 'In the 50/30/20 framework, "needs" are defined as:', choices: ['Essential expenses required for basic functioning — housing, groceries, utilities, and minimum debt payments', 'Anything you purchase more than once per month', 'All expenses that bring long-term happiness', 'Expenses under a certain dollar threshold'], a: 0 },
          { q: 'Zero-based budgeting differs from 50/30/20 primarily because:', choices: ['ZBB requires assigning every specific dollar to a named category; 50/30/20 uses broad percentage buckets', 'ZBB is only for people with zero savings', 'ZBB requires no tracking at all', 'Zero-based means saving zero dollars each month'], a: 0 },
          { q: 'The envelope budgeting method is psychologically effective because:', choices: ['The physical/visual constraint of a finite amount of cash makes overspending more tangible and harder to ignore', 'Envelopes earn interest that digital accounts do not', 'It requires bank approval before spending', 'It eliminates the need to think about spending at all'], a: 0 },
          { q: 'The "anti-budget" or Pay Yourself First approach is best suited for:', choices: ['People who hate detailed tracking but can commit to automating savings and investments upfront', 'People with no income who need to track every cent', 'Anyone with high-interest debt that needs active management', 'Beginners who have never tracked expenses before'], a: 0 },
          { q: 'Why do most people "fail" at budgeting according to financial experts?', choices: ['They treat it as a one-time setup rather than a living monthly system that requires regular iteration', 'Budgeting is fundamentally too complex for most people', 'They track too many categories and become overwhelmed', 'They don\'t use the right app or software'], a: 0 },
          { q: 'Net worth is calculated as:', choices: ['Total assets (what you own) minus total liabilities (what you owe)', 'Monthly income minus monthly expenses', 'Savings account balance plus investment account balance', 'Annual income minus annual taxes paid'], a: 0 },
          { q: 'A budgeting app that auto-categorizes transactions is most useful when:', choices: ['Combined with weekly or monthly personal review — automation reduces friction but doesn\'t replace engagement', 'Set up once and then never reviewed again', 'Used exclusively without any personal financial awareness', 'Shared with your bank for automatic bill payment'], a: 0 },
          { q: 'If someone following the 50/30/20 rule earns $4,000/month after taxes, how much should go to savings and debt paydown?', choices: ['$800 (20% of $4,000)', '$2,000 (50% of $4,000)', '$1,200 (30% of $4,000)', '$400 (10% of $4,000)'], a: 0 },
          { q: 'Tracking net worth quarterly in addition to monthly budgeting helps because:', choices: ['It shows whether your daily spending habits are actually building wealth and moving your financial position in the right direction', 'Net worth tracking is required by tax law for most earners', 'It replaces the need for monthly budgeting once you reach a certain income', 'It automatically adjusts your budget percentages based on market performance'], a: 0 }
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
          { q: 'The Rule of 72 tells you:', choices: ['How many years it takes to double your money — calculated by dividing 72 by your annual interest rate', 'The maximum percentage you should put in stocks', 'The ideal savings rate as a percentage of income', 'The number of months before compound interest begins to apply'], a: 0 },
          { q: 'Why does starting to invest at 22 vs. 32 produce such dramatically different outcomes at retirement?', choices: ['A decade of additional compounding means more years of interest earning interest on itself — the early years generate decades of exponential growth', 'Younger investors get preferential tax treatment from the IRS', 'Investment fees are lower for younger account holders', 'Stock markets always perform better for younger investors statistically'], a: 0 },
          { q: 'Dollar-cost averaging is a strategy where:', choices: ['You invest a fixed amount on a regular schedule regardless of market conditions, automatically buying more shares when prices drop', 'You wait for the market to fall before making any investments', 'You divide your portfolio equally across 72 different assets', 'You only invest during months when the market is trending upward'], a: 0 },
          { q: 'A Roth IRA is advantageous for long-term wealth building because:', choices: ['Contributions grow completely tax-free — you pay taxes on contributions now but pay nothing on decades of gains when you withdraw', 'It earns higher interest rates than any other account type', 'It is insured against stock market losses by the government', 'Contributions can be deducted from your taxable income each year'], a: 0 },
          { q: 'Inflation acts as "reverse compounding" because:', choices: ['Purchasing power erodes exponentially over time — at 3% inflation, money loses roughly half its value in ~24 years if not invested', 'It causes interest rates on savings accounts to automatically decrease', 'It only affects people who don\'t budget their expenses carefully', 'It increases the nominal dollar amount in your account even as real value falls'], a: 0 },
          { q: 'At a 7% annual return, approximately how long does it take for $5,000 to grow to $10,000?', choices: ['About 10 years (using the Rule of 72: 72 ÷ 7 ≈ 10.3 years)', 'About 5 years because 7% × 5 = 35%', 'About 14 years because you must account for inflation', 'Exactly 7 years — one year per percentage point'], a: 0 },
          { q: 'The historical average annual return of the S&P 500 (before inflation) is approximately:', choices: ['~10% per year, which is the standard assumption used in long-term financial planning', '~3–4%, roughly matching the rate of inflation', '~20%, reflecting only the best decades of performance', '~7%, which already accounts for inflation adjustment'], a: 0 },
          { q: 'Keeping $20,000 in cash in a low-yield checking account for 10 years when you won\'t need it carries what hidden cost?', choices: ['The opportunity cost of forgone investment growth, plus the real loss of purchasing power to inflation over the decade', 'No cost — cash is always safe and loses nothing', 'Only the risk of physical theft or loss', 'A small monthly fee from the bank for holding excess cash'], a: 0 },
          { q: 'Compound interest is fundamentally different from simple interest because:', choices: ['Compound interest earns returns on previously accumulated interest, not just the original principal — creating exponential rather than linear growth', 'Simple interest earns more money faster in the early years', 'Compound interest only applies to investment accounts, not savings accounts', 'Simple interest is more beneficial for long periods; compound interest is better short-term'], a: 0 }
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
    tag: 'Credit Pro',
    tagColor: '#fee2e2',
    tagText: '#991b1b',
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
          { q: 'What is the key difference between a credit report and a credit score?', choices: ['A report is the full detailed account history from credit bureaus; a score is a 3-digit number calculated from that report data', 'They are two names for the same document issued by the same agency', 'A score contains more detailed information than a report', 'Credit reports are issued monthly; scores are annual'], a: 0 },
          { q: 'A "hard inquiry" on your credit report occurs when:', choices: ['You apply for a new line of credit and a lender formally reviews your credit file — temporarily lowering your score by a few points', 'You check your own credit score on a monitoring app', 'A company sends you a pre-approved offer in the mail', 'Your existing card issuer reviews your account during their annual audit'], a: 0 },
          { q: 'Credit utilization ratio is calculated as:', choices: ['Your total credit card balances divided by your total credit limits, expressed as a percentage', 'The number of credit cards you own divided by your annual income', 'Your total debt divided by your annual salary', 'The age of your oldest account divided by the number of total accounts'], a: 0 },
          { q: 'A secured credit card differs from a regular credit card because:', choices: ['It requires a cash deposit as collateral, which becomes your credit limit — making it accessible to people with no or damaged credit history', 'It offers better rewards than standard credit cards', 'It cannot be used at retailers — only ATMs', 'It is only available to people with credit scores above 700'], a: 0 },
          { q: 'Which types of organizations commonly check your credit history beyond just banks?', choices: ['Landlords, certain employers (in applicable states), utility companies, and insurance providers in addition to lenders', 'Only banks and mortgage companies are legally allowed to check credit', 'Just credit card companies and auto lenders', 'Government agencies and tax authorities exclusively'], a: 0 },
          { q: 'Using 75% of your credit card limit consistently signals to credit bureaus that you:', choices: ['May be financially overextended — high utilization rates correlate with increased default risk in credit scoring models', 'Are an excellent customer deserving of a credit limit increase', 'Have strong spending power and should receive premium card offers', 'Are using credit correctly and maintaining an active account'], a: 0 },
          { q: 'The three major credit bureaus are:', choices: ['Equifax, Experian, and TransUnion — each maintaining independent credit files that may contain slightly different information', 'FICO, VantageScore, and Equifax — the three official scoring agencies', 'The Federal Reserve, FDIC, and CFPB', 'Mastercard, Visa, and American Express'], a: 0 },
          { q: 'A credit-builder loan is designed specifically to:', choices: ['Help people with no credit history or poor credit establish a positive payment record by reporting on-time payments to all three bureaus', 'Allow people to borrow large sums without a credit check', 'Consolidate existing high-interest credit card debt at a lower rate', 'Provide emergency funds to people who cannot get traditional loans'], a: 0 },
          { q: 'Why is credit described as a "tool" rather than free money?', choices: ['Every borrowed dollar must be repaid — typically with interest — meaning credit always costs more than the face value borrowed unless paid in full before interest accrues', 'Because it can only be used for tools and home improvement projects', 'Lenders are legally required to frame it as a tool in disclosures', 'Because it works best when used for purchases that appreciate in value'], a: 0 }
        ]
      },
      {
        title: 'Interest, APR & the True Cost of Debt',
        info: [
          'APR (Annual Percentage Rate) is the annualized cost of borrowing, including interest and mandatory fees. It enables apples-to-apples comparison across loan products. A credit card charging 2% monthly has a 24% APR — which sounds worse when annualized for a reason: it is.',
          'Compound interest on debt works against you the same way it works for investments. Carrying a $5,000 credit card balance at 24% APR and paying only the minimum ($100/month) takes approximately 8 years to pay off and costs about $4,300 in interest — nearly doubling the original debt.',
          'The difference between simple and compound interest matters enormously in debt: most installment loans (car, mortgage) use simple interest — interest is calculated only on the remaining principal. Most credit cards use compound interest — unpaid interest is added to the principal and interest accrues on that new total.',
          'The avalanche method of debt repayment: pay minimum payments on all debts, then direct all extra money toward the highest-interest debt first. Mathematically optimal — saves the most money. The snowball method (smallest balance first) is less efficient but psychologically more motivating for some people.',
          'Balance transfer cards offer 0% APR promotional periods (typically 12–21 months) to move high-interest debt. They can save hundreds in interest but carry risks: balance transfer fees (3–5%), the promotional rate expiring, and the temptation to accumulate new debt on the original card.',
          'Fixed vs. variable interest rates: fixed rates stay constant for the loan\'s life (most mortgages, student loans). Variable rates fluctuate with market benchmarks like the SOFR or Prime Rate (most credit cards, HELOCs). Variable rates can be lower initially but create repayment uncertainty.',
          'Interest rate arbitrage: if your savings account earns 4.5% and you carry credit card debt at 20% APR, paying off the debt first is a guaranteed 20% risk-free return — no investment reliably beats paying off high-interest debt.'
        ],
        quiz: [
          { q: 'A credit card with a 2% monthly interest rate has an APR of approximately:', choices: ['24% (2% × 12 months) — though actual APR may be slightly higher due to compounding', '2% — APR is always the same as the monthly rate', '0.17% — the monthly rate divided by 12', '12% — the monthly rate multiplied by 6'], a: 0 },
          { q: 'Carrying a $5,000 credit card balance at 24% APR while only paying the monthly minimum results in:', choices: ['Years of repayment and thousands in interest charges — potentially doubling the original balance paid over time', 'The balance being cleared within 12 months at no additional cost', 'A fixed $1,200 interest charge for the year regardless of payment timing', 'Automatic forgiveness of the interest if you pay consistently'], a: 0 },
          { q: 'The debt avalanche method prioritizes:', choices: ['Paying off the highest-interest-rate debt first while maintaining minimums on all others — mathematically the lowest-cost payoff strategy', 'Paying off the smallest balance first for psychological momentum', 'Paying equal extra amounts across all debts simultaneously', 'Consolidating all debt into one loan before making any payments'], a: 0 },
          { q: 'A 0% APR balance transfer offer requires careful attention to:', choices: ['The transfer fee (3–5%), the promotional period end date, and the risk of accumulating new debt on the original card', 'Nothing — 0% APR is always risk-free and universally beneficial', 'Only the credit limit of the new card', 'The rewards program attached to the new card'], a: 0 },
          { q: 'If your emergency fund earns 4.5% APY and you carry credit card debt at 22% APR, the financially optimal decision is:', choices: ['Pay off the credit card debt aggressively — eliminating 22% interest is a guaranteed "return" that no savings account can match', 'Keep funding the emergency fund since it\'s earning a positive return', 'Invest in stocks instead since they historically return more than 4.5%', 'Maintain a balance on the card to continue building credit history'], a: 0 },
          { q: 'Compound interest on credit card debt means:', choices: ['Unpaid interest is added to the balance, and next month\'s interest is calculated on that higher total — creating accelerating debt growth', 'You earn interest back on your debt for being a loyal customer', 'Interest is charged once per year and divided into monthly installments', 'Your interest rate compounds downward as you make consistent payments'], a: 0 },
          { q: 'Fixed vs. variable interest rates differ primarily in that:', choices: ['Fixed rates stay constant for the entire loan term; variable rates fluctuate with market benchmarks and can increase unexpectedly', 'Fixed rates are always lower than variable rates', 'Variable rates are regulated by the government and cannot exceed fixed rates', 'Fixed rates only apply to mortgages; all other loans are variable'], a: 0 },
          { q: 'The debt snowball method is less mathematically efficient than the avalanche method but may be preferable for some people because:', choices: ['Eliminating smaller balances quickly creates psychological wins and motivation that help people stay committed to debt repayment', 'It results in lower total interest paid over the payoff period', 'It is the method recommended by all major financial institutions', 'It reduces the number of required minimum payments more quickly'], a: 0 },
          { q: 'APR allows for meaningful loan comparison because:', choices: ['It standardizes the cost of borrowing into a single annualized percentage including fees — making otherwise incomparable loan structures directly comparable', 'All lenders are legally required to charge the same APR for similar products', 'It represents the maximum amount you\'ll ever pay in interest', 'It accounts for inflation and adjusts your rate automatically'], a: 0 }
        ]
      },
      {
        title: 'Your Credit Score: How It Works',
        info: [
          'FICO scores (the most widely used model) range from 300–850 and are calculated from five weighted factors: Payment History (35%) — the most important; Amounts Owed / Utilization (30%); Length of Credit History (15%); Credit Mix (10%); and New Credit / Inquiries (10%).',
          'Score ranges and their practical implications: 800–850 (Exceptional) qualifies for the best rates on any loan. 740–799 (Very Good) still qualifies for excellent rates. 670–739 (Good) — most loans approved, competitive but not best rates. 580–669 (Fair) — approval likely but significantly higher rates. Below 580 (Poor) — many applications denied, or approved only with very high rates and collateral.',
          'A single 30-day late payment can drop a score by 60–110 points depending on starting score and history — and it remains on your report for 7 years. The higher your score before the late payment, the more dramatic the drop, because the scoring model punishes unexpected deviations more than a pattern of poor history.',
          'Length of credit history rewards age — specifically the age of your oldest account, newest account, and average account age. This is why financial experts advise against closing old credit cards even if you no longer use them actively: closing them reduces your average account age and can shrink your total available credit, both hurting your score.',
          'Credit mix rewards having experience with different credit types: revolving (credit cards) and installment (auto, student, personal loans). Having only one type isn\'t disqualifying, but adding diversity when appropriate (and when the terms make financial sense) can modestly improve your score.',
          'You are legally entitled to one free credit report per year from each of the three bureaus (Equifax, Experian, TransUnion) at annualcreditreport.com — the only federally authorized source. Errors appear on 1 in 5 credit reports; disputing them is free and can meaningfully improve your score.',
          'Credit score misconceptions: your income has no direct effect on your score. Checking your own score is a soft inquiry and has zero impact. Being denied credit does not hurt your score. Carrying a small monthly balance does NOT help your score — paying in full is always better.'
        ],
        quiz: [
          { q: 'The single most heavily weighted factor in a FICO credit score is:', choices: ['Payment History at 35% — whether you pay all accounts on time is the largest determinant of your score', 'Credit Utilization at 30% — how much of your available credit you\'re using', 'Length of Credit History at 15% — how long you\'ve had credit accounts', 'Credit Mix at 10% — the variety of credit types you hold'], a: 0 },
          { q: 'A 30-day late payment on a credit card can impact your credit score by:', choices: ['Dropping it 60–110 points — and the impact is paradoxically worse for people with higher scores since it represents a larger deviation from their history', 'Reducing it by exactly 5 points per day late', 'Having no effect until the account is 90+ days past due', 'Temporarily lowering it 2–5 points like a hard inquiry'], a: 0 },
          { q: 'Why is closing an old, unused credit card often a mistake for your credit score?', choices: ['It reduces your average account age and total available credit, potentially increasing your utilization ratio — all of which can lower your score', 'Card issuers charge a closing penalty that hurts your score directly', 'Closed accounts immediately disappear from your credit report, erasing positive history', 'It triggers a hard inquiry every time you close an account'], a: 0 },
          { q: 'A credit score of 680 vs. 760 on a 30-year $300,000 mortgage likely translates to:', choices: ['Thousands of dollars in additional interest over the loan\'s life — potentially $30,000–$60,000+ due to a higher interest rate on a score of 680', 'Identical loan terms — lenders care more about income than score', 'A $500 fee difference total — minor and easily recovered', 'Only a difference in the application processing time'], a: 0 },
          { q: 'Checking your own credit score on a monitoring service like Credit Karma:', choices: ['Is a soft inquiry with zero impact on your credit score — you can check it as frequently as you like', 'Reduces your score by 5 points each time you check', 'Only allowed once per year under federal law', 'Affects your score the same way a credit application does'], a: 0 },
          { q: 'Having only credit card accounts and no installment loans affects your score because:', choices: ['You miss out on the Credit Mix category (10% of score) — diversity across revolving and installment credit is rewarded', 'Credit bureaus automatically penalize single-type credit users by 50 points', 'Cards alone are sufficient for a perfect 850 score with no downsides', 'Installment loans are only required for scores above 800'], a: 0 },
          { q: 'Errors appear on approximately what percentage of credit reports according to the FTC?', choices: ['About 1 in 5 (20%) of credit reports contain at least one error — making regular review important for financial health', 'Less than 1% — credit bureau data entry is highly accurate', 'Over 50% contain significant errors affecting lending decisions', 'Exactly 5% — the federally regulated maximum error rate'], a: 0 },
          { q: 'Which of the following has NO direct effect on your FICO credit score?', choices: ['Your annual income or salary level — lenders use this separately, but it is not a component of credit score calculation', 'Whether you pay on time or late', 'How much of your credit limit you regularly use', 'How long you\'ve had your oldest account open'], a: 0 },
          { q: 'The legally mandated free credit report source authorized by federal law is:', choices: ['AnnualCreditReport.com — the only federally authorized source for free reports from all three bureaus once per year', 'CreditKarma.com — which provides government-mandated free scores', 'Your bank\'s mobile app — required by the Dodd-Frank Act to provide free annual reports', 'Any of the three bureaus\' individual websites for a fee waived annually'], a: 0 }
        ]
      }
    ]
  }
];

const QUESTIONS_PER_QUIZ = 9;

const ensureQuestions = (questions) => {
  const q = [...questions];
  while (q.length < QUESTIONS_PER_QUIZ) q.push(questions[q.length % questions.length]);
  return q.slice(0, QUESTIONS_PER_QUIZ);
};

const randomizeQuestion = (question) => {
  const correctText = question.choices[question.a];
  const choices = [...question.choices].sort(() => Math.random() - 0.5);
  const a = choices.indexOf(correctText);
  return { ...question, choices, a };
};

const COMPLETION_DATE = new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });

export default function CoursesScreen({ courseProgressMap = {}, setCourseProgressMap, onCourseComplete, username = '', userTier = 'adult' }) {
  const [page, setPage] = useState('list');
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [currentLesson, setCurrentLesson] = useState(0);
  const [quiz, setQuiz] = useState(null);
  const [result, setResult] = useState(null);
  const [answerFeedback, setAnswerFeedback] = useState(null);
  const [completedCourseTitle, setCompletedCourseTitle] = useState('');
  const [completionDate, setCompletionDate] = useState('');
  // FIX: Initialize with courseProgressMap and merge — never replace — on prop changes
  const [localProgressMap, setLocalProgressMap] = useState(() => courseProgressMap || {});
  const [courseCompleteMarked, setCourseCompleteMarked] = useState(false);

  // FIX: Update local state when props change
  useEffect(() => {
    if (courseProgressMap) {
      setLocalProgressMap(prev => ({ ...courseProgressMap, ...prev }));
    }
  }, [courseProgressMap]);

  // Single source of truth: localProgressMap (initialized from prop, merged on prop changes)
  const effectiveProgressMap = localProgressMap;

  const isElementary = userTier === 'elementary';
  const courseHeading = isElementary ? 'Money Adventures' : 'Courses';
  const courseSubtitle = isElementary
    ? 'Fun lessons, easy quizzes, and helpful tips for younger learners.'
    : 'Learn practical money skills, pass quizzes, and earn certificates.';

  const course = useMemo(() => coursesData.find((c) => c.id === currentCourseId), [currentCourseId]);
  const lesson = course?.lessons?.[currentLesson];

  const courseLessonDone = (courseId, lessonIdx) =>
    Boolean(effectiveProgressMap?.[`course_${courseId}_lesson_${lessonIdx}`]);

  const lessonsCompletedCount = (courseId) => {
    const c = coursesData.find((x) => x.id === courseId);
    if (!c) return 0;
    return c.lessons.reduce((sum, _, idx) => sum + (courseLessonDone(courseId, idx) ? 1 : 0), 0);
  };

  const getCourseProgressPct = (courseId) => {
    const c = coursesData.find((x) => x.id === courseId);
    if (!c) return 0;
    return lessonsCompletedCount(courseId) / c.lessons.length;
  };

  const totalCoursesFinished = coursesData.filter((c) => lessonsCompletedCount(c.id) === c.lessons.length).length;

  const getFirstIncompleteLessonIdx = (courseId) => {
    const c = coursesData.find((x) => x.id === courseId);
    if (!c) return 0;
    for (let idx = 0; idx < c.lessons.length; idx += 1) {
      if (!courseLessonDone(courseId, idx)) return idx;
    }
    return 0;
  };

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
    setCurrentLesson(getFirstIncompleteLessonIdx(id));
    setPage('lesson');
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
    const question = quiz.questions[quiz.index];
    const isCorrect = answerFeedback.correct;
    const nextIndex = quiz.index + 1;
    const updatedWrong = isCorrect
      ? quiz.wrong
      : [...quiz.wrong, { q: question.q, selected: answerFeedback.selected, correctAnswer: answerFeedback.correctAnswer }];
    const updatedCorrect = quiz.correct + (isCorrect ? 1 : 0);

    if (nextIndex >= quiz.questions.length) {
      const score = Math.round((updatedCorrect / quiz.questions.length) * 100);
      const passed = score >= 70;
      const progressKey = `course_${course.id}_lesson_${currentLesson}`;

      if (passed) {
        // FIX: Always merge into existing map
        setLocalProgressMap((prev) => ({ ...prev, [progressKey]: 1 }));
        setCourseProgressMap?.(progressKey, 1);
      }

      setResult({ score, passed, correct: updatedCorrect, total: quiz.questions.length, wrong: updatedWrong });
      setQuiz(null);
      setAnswerFeedback(null);
      setPage('result');

      if (passed && currentLesson + 1 >= (course?.lessons?.length || 0) && !courseCompleteMarked) {
        setCourseCompleteMarked(true);
        onCourseComplete?.(course.id);
        setCompletedCourseTitle(course.title);
        setCompletionDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
      }
      return;
    }
    setQuiz({ ...quiz, index: nextIndex, correct: updatedCorrect, wrong: updatedWrong });
    setAnswerFeedback(null);
  };

  const handleContinueAfterResult = () => {
    if (!result) return;
    if (!result.passed) { handleBeginQuiz(); return; }

    const nextLessonIdx = currentLesson + 1;
    if (nextLessonIdx < (course?.lessons?.length || 0)) {
      setCurrentLesson(nextLessonIdx);
      setResult(null);
      setPage('lesson');
      return;
    }

    if (!courseCompleteMarked) {
      onCourseComplete?.(course.id);
      setCourseCompleteMarked(true);
      setCompletedCourseTitle(course.title);
      setCompletionDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    }
    setPage('certificate');
  };

  // ─── LIST VIEW ───────────────────────────────────────────────────────────────
  if (page === 'list') {
    return (
      <div style={cStyles.container}>
        <div style={cStyles.header}>
          <div>
            <div style={cStyles.headerBadge}>{isElementary ? '🧠 Money Adventures' : '📚 Learning Track'}</div>
            <h2 style={cStyles.headerTitle}>{courseHeading}{username ? ` for ${username}` : ''}</h2>
            <p style={cStyles.headerSub}>{courseSubtitle}</p>
          </div>
          <div style={cStyles.completedPill}>
            <span style={{ fontSize: '20px' }}>🎓</span>
            <div>
              <div style={{ fontWeight: '800', fontSize: '20px' }}>{totalCoursesFinished}/3</div>
              <div style={{ fontSize: '11px', opacity: 0.8 }}>Completed</div>
            </div>
          </div>
        </div>

        <div style={cStyles.grid}>
          {coursesData.map((c) => {
            const progressValue = getCourseProgressPct(c.id);
            const lessonsDoneCount = lessonsCompletedCount(c.id);
            const isFinished = lessonsDoneCount === c.lessons.length;
            const hasStarted = lessonsDoneCount > 0 && !isFinished;

            return (
              <div key={c.id} style={cStyles.courseCard}>
                <div style={{ ...cStyles.courseCardTop, background: c.gradient }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '40px' }}>{c.emoji}</span>
                    <span style={{ ...cStyles.courseTierTag, background: 'rgba(255,255,255,0.25)', color: '#fff' }}>{c.tag}</span>
                  </div>
                  <h3 style={cStyles.courseCardTitle}>{c.title}</h3>
                  <p style={cStyles.courseCardSub}>{c.lessons.length} lessons · quiz after each</p>
                </div>
                <div style={cStyles.courseCardBottom}>
                  <div style={{ marginBottom: '12px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                      <span>{lessonsDoneCount}/{c.lessons.length} lessons</span>
                      <span>{Math.round(progressValue * 100)}%</span>
                    </div>
                    <ProgressBar progress={progressValue} />
                  </div>
                  <button
                    onClick={() => handleStartCourse(c.id, isFinished)}
                    style={{
                      ...cStyles.startBtn,
                      background: isFinished ? '#f0fdf4' : c.gradient,
                      color: isFinished ? '#166534' : '#fff',
                      border: isFinished ? '2px solid #86efac' : 'none'
                    }}
                  >
                    {isFinished ? '✓ Review Course' : hasStarted ? `▶ Resume (Lesson ${lessonsDoneCount + 1})` : '▶ Start Course'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  // ─── LESSON VIEW ─────────────────────────────────────────────────────────────
  if (page === 'lesson' && course && lesson) {
    const currentCompleted = lessonsCompletedCount(course.id);
    return (
      <div style={cStyles.innerContainer}>
        <button onClick={() => setPage('list')} style={cStyles.backBtn}>← Back to courses</button>
        <div style={{ ...cStyles.courseHeaderBar, background: course.gradient }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '14px' }}>
            <span style={{ fontSize: '28px' }}>{course.emoji}</span>
            <div>
              <h2 style={{ margin: 0, color: '#fff', fontSize: '20px', fontWeight: '800' }}>{course.title}</h2>
              <p style={{ margin: 0, color: 'rgba(255,255,255,0.8)', fontSize: '13px' }}>Lesson {currentLesson + 1} of {course.lessons.length}</p>
            </div>
          </div>
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', color: 'rgba(255,255,255,0.8)', fontSize: '12px', marginBottom: '6px', fontWeight: '600' }}>
              <span>Course Progress</span>
              <span>{currentCompleted}/{course.lessons.length} lessons complete</span>
            </div>
            <div style={{ height: '6px', background: 'rgba(255,255,255,0.3)', borderRadius: '999px', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${(currentCompleted / course.lessons.length) * 100}%`, background: '#fff', borderRadius: '999px', transition: 'width 0.4s ease' }} />
            </div>
          </div>
        </div>
        <div style={cStyles.lessonCard}>
          <div style={{ ...cStyles.lessonNumBadge, background: course.gradient }}>Lesson {currentLesson + 1}</div>
          <h3 style={cStyles.lessonTitle}>{lesson.title}</h3>
          <div style={cStyles.lessonInfoList}>
            {lesson.info.map((line, idx) => (
              <div key={idx} style={cStyles.lessonInfoItem}>
                <div style={{ ...cStyles.lessonInfoDot, background: course.color }} />
                <p style={cStyles.lessonInfoText}>{line}</p>
              </div>
            ))}
          </div>
          <button onClick={handleBeginQuiz} style={{ ...cStyles.quizBtn, background: course.gradient }}>📝 Take the Quiz</button>
        </div>
      </div>
    );
  }

  // ─── QUIZ VIEW ───────────────────────────────────────────────────────────────
  if (page === 'quiz' && quiz) {
    const q = quiz.questions[quiz.index];
    const progressPct = ((quiz.index) / quiz.questions.length) * 100;
    return (
      <div style={cStyles.innerContainer}>
        <div style={cStyles.quizHeaderCard}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
            <span style={{ fontWeight: '700', color: '#1e293b', fontSize: '15px' }}>Question {quiz.index + 1} / {quiz.questions.length}</span>
            <span style={{ ...cStyles.scoreChip, background: course?.gradient }}>✅ {quiz.correct} correct</span>
          </div>
          <div style={{ height: '6px', background: '#e2e8f0', borderRadius: '999px', overflow: 'hidden' }}>
            <div style={{ height: '100%', width: `${progressPct}%`, background: course?.gradient || '#2563eb', borderRadius: '999px', transition: 'width 0.3s ease' }} />
          </div>
        </div>
        <div style={cStyles.quizCard}>
          <div style={{ ...cStyles.questionNumBadge, background: course?.color + '20', color: course?.color }}>Q{quiz.index + 1}</div>
          <p style={cStyles.questionText}>{q.q}</p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {q.choices.map((choice, i) => {
              const isCorrect = i === q.a;
              const isSelectedWrong = answerFeedback && !answerFeedback.correct && answerFeedback.selected === choice;
              const btnStyle = {
                ...cStyles.choiceBtn,
                cursor: answerFeedback ? 'default' : 'pointer',
                background: '#f8fafc',
                borderColor: '#e2e8f0',
                color: '#334155',
                fontWeight: 500,
                ...(answerFeedback && isCorrect ? { background: '#d1fae5', borderColor: '#22c55e', color: '#065f46', fontWeight: 700 } : {}),
                ...(answerFeedback && isSelectedWrong ? { background: '#fee2e2', borderColor: '#ef4444', color: '#991b1b', fontWeight: 700 } : {})
              };
              return <button key={i} onClick={() => handlePickAnswer(i)} disabled={!!answerFeedback} style={btnStyle}><span style={cStyles.choiceLetter}>{['A', 'B', 'C', 'D'][i]}</span>{choice}</button>;
            })}
          </div>
          {answerFeedback && (
            <div style={{ ...cStyles.feedbackBox, background: answerFeedback.correct ? '#d1fae5' : '#fee2e2', borderColor: answerFeedback.correct ? '#6ee7b7' : '#fca5a5' }}>
              <p style={{ fontWeight: '800', margin: '0 0 4px', fontSize: '16px', color: answerFeedback.correct ? '#065f46' : '#991b1b' }}>{answerFeedback.correct ? '✅ Correct!' : '❌ Not quite.'}</p>
              {!answerFeedback.correct && <p style={{ margin: '0 0 10px', color: '#475569', fontSize: '14px' }}>Correct answer: <strong>{answerFeedback.correctAnswer}</strong></p>}
              <button onClick={handleNextQuestion} style={{ ...cStyles.nextBtn, background: course?.gradient || '#2563eb' }}>{quiz.index + 1 >= quiz.questions.length ? 'See Results →' : 'Next Question →'}</button>
            </div>
          )}
        </div>
      </div>
    );
  }

  // ─── REVIEW VIEW ─────────────────────────────────────────────────────────────
  if (page === 'review' && course) {
    return (
      <div style={cStyles.innerContainer}>
        <button onClick={() => setPage('list')} style={cStyles.backBtn}>← Back to courses</button>
        <div style={{ ...cStyles.courseHeaderBar, background: course.gradient, padding: '24px 28px' }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '28px', fontWeight: '900' }}>100% Complete — Review</h2>
          <p style={{ margin: '10px 0 0', color: 'rgba(255,255,255,0.9)', fontSize: '15px' }}>Well done! Here's everything you learned in this course.</p>
        </div>
        <div style={cStyles.reviewCard}>
          <div style={cStyles.reviewSummary}>
            <span style={cStyles.reviewBadge}>Course Complete</span>
            <div style={cStyles.reviewScore}>100%</div>
            <p style={{ margin: '0', color: '#475569', fontSize: '14px' }}>You have finished every lesson. Review the key ideas below.</p>
          </div>
          {course.lessons.map((les, idx) => (
            <div key={idx} style={cStyles.reviewItem}>
              <div style={cStyles.reviewLessonTitle}>Lesson {idx + 1}: {les.title}</div>
              <ul style={cStyles.reviewList}>
                {les.info.map((line, index) => (
                  <li key={index} style={cStyles.reviewListItem}>{line}</li>
                ))}
              </ul>
            </div>
          ))}
          <button onClick={() => setPage('list')} style={{ ...cStyles.continueBtn, background: course.gradient, marginTop: '20px' }}>← Back to Courses</button>
        </div>
      </div>
    );
  }

  // ─── RESULT VIEW ─────────────────────────────────────────────────────────────
  if (page === 'result' && result) {
    return (
      <div style={cStyles.innerContainer}>
        <div style={{ ...cStyles.resultCard, background: result.passed ? 'linear-gradient(135deg,#065f46,#059669)' : 'linear-gradient(135deg,#7f1d1d,#dc2626)' }}>
          <div style={{ fontSize: '60px', marginBottom: '8px' }}>{result.passed ? '🎉' : '😤'}</div>
          <h2 style={{ color: '#fff', margin: '0 0 6px', fontSize: '28px', fontWeight: '900' }}>{result.passed ? 'Quiz Passed!' : 'Not Quite!'}</h2>
          <div style={cStyles.scoreDisplay}><div style={cStyles.scoreCircle}><span style={{ fontSize: '28px', fontWeight: '900', color: result.passed ? '#059669' : '#dc2626' }}>{result.score}%</span></div></div>
          <p style={{ color: 'rgba(255,255,255,0.9)', margin: '0 0 4px' }}>{result.correct} / {result.total} correct</p>
          {!result.passed && <p style={{ color: '#fca5a5', fontWeight: '700', margin: '4px 0 0' }}>You need 70% to pass — you can do it!</p>}
        </div>
        {result.wrong.length > 0 && (
          <div style={cStyles.wrongAnswersCard}>
            <h3 style={{ margin: '0 0 14px', fontSize: '16px', color: '#1e293b' }}>📋 Review Your Mistakes</h3>
            {result.wrong.map((w, i) => (
              <div key={i} style={cStyles.wrongItem}>
                <p style={{ margin: '0 0 4px', fontWeight: '600', color: '#1e293b', fontSize: '14px' }}>{w.q}</p>
                <p style={{ margin: '0 0 2px', color: '#dc2626', fontSize: '13px' }}>❌ Your answer: {w.selected}</p>
                <p style={{ margin: 0, color: '#059669', fontSize: '13px' }}>✅ Correct: {w.correctAnswer}</p>
              </div>
            ))}
          </div>
        )}
        <button onClick={handleContinueAfterResult} style={{ ...cStyles.continueBtn, background: result.passed ? course?.gradient || '#059669' : 'linear-gradient(135deg,#f59e0b,#d97706)' }}>{result.passed ? (currentLesson + 1 < (course?.lessons?.length || 0) ? '▶ Next Lesson' : '🎓 Finish Course') : '🔄 Retry Quiz'}</button>
      </div>
    );
  }

  // ─── CERTIFICATE VIEW ────────────────────────────────────────────────────────
  if (page === 'certificate') {
    const certColor = course?.color || '#6366f1';
    const certGradient = course?.gradient || 'linear-gradient(135deg,#6366f1,#8b5cf6)';
    return (
      <div style={cStyles.innerContainer}>
        {/* Outer decorative wrapper */}
        <div style={{
          position: 'relative',
          borderRadius: '28px',
          padding: '4px',
          background: `conic-gradient(from 0deg, #f59e0b, #fbbf24, #fde68a, #f59e0b, #d97706, #fbbf24, #f59e0b)`,
          boxShadow: '0 32px 80px rgba(0,0,0,0.22), 0 8px 24px rgba(0,0,0,0.12)',
        }}>
          <div style={{
            borderRadius: '25px',
            overflow: 'hidden',
            background: '#fffef7',
          }}>

            {/* Top color band */}
            <div style={{
              background: certGradient,
              padding: '36px 32px 28px',
              textAlign: 'center',
              position: 'relative',
              overflow: 'hidden',
            }}>
              {/* Decorative circles in background */}
              <div style={{ position: 'absolute', top: -40, left: -40, width: 180, height: 180, borderRadius: '50%', background: 'rgba(255,255,255,0.08)' }} />
              <div style={{ position: 'absolute', bottom: -60, right: -30, width: 220, height: 220, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
              <div style={{ position: 'absolute', top: 20, right: 30, width: 80, height: 80, borderRadius: '50%', background: 'rgba(255,255,255,0.1)' }} />

              <div style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '80px', height: '80px', borderRadius: '50%',
                background: 'rgba(255,255,255,0.2)', backdropFilter: 'blur(8px)',
                border: '3px solid rgba(255,255,255,0.5)',
                fontSize: '44px', marginBottom: '14px',
                boxShadow: '0 8px 24px rgba(0,0,0,0.2)',
                position: 'relative',
              }}>🎓</div>

              <div style={{ fontSize: '10px', fontWeight: '800', letterSpacing: '4px', color: 'rgba(255,255,255,0.85)', textTransform: 'uppercase', marginBottom: '6px' }}>
                ✦ Certificate of Completion ✦
              </div>
              <div style={{ width: '60px', height: '2px', background: 'rgba(255,255,255,0.4)', margin: '0 auto' }} />
            </div>

            {/* Main certificate body */}
            <div style={{
              padding: '32px 36px 36px',
              textAlign: 'center',
              background: 'linear-gradient(180deg, #fffef7 0%, #fefce8 100%)',
              position: 'relative',
            }}>
              {/* Decorative corner flourishes */}
              <div style={{ position: 'absolute', top: 12, left: 16, fontSize: '22px', opacity: 0.25 }}>✦</div>
              <div style={{ position: 'absolute', top: 12, right: 16, fontSize: '22px', opacity: 0.25 }}>✦</div>
              <div style={{ position: 'absolute', bottom: 16, left: 16, fontSize: '22px', opacity: 0.25 }}>✦</div>
              <div style={{ position: 'absolute', bottom: 16, right: 16, fontSize: '22px', opacity: 0.25 }}>✦</div>

              <p style={{ color: '#92400e', margin: '0 0 4px', fontSize: '13px', fontWeight: '600', letterSpacing: '1px', textTransform: 'uppercase' }}>
                This certifies that
              </p>

              {/* Recipient name with underline decoration */}
              <div style={{ margin: '10px 0 16px', position: 'relative', display: 'inline-block' }}>
                <h2 style={{
                  margin: 0, fontSize: '34px', fontWeight: '900', color: '#1c1917',
                  letterSpacing: '-0.5px', fontStyle: 'italic',
                }}>
                  {username || 'Learner'}
                </h2>
                <div style={{
                  height: '3px', borderRadius: '2px',
                  background: `linear-gradient(90deg, transparent, ${certColor}, transparent)`,
                  marginTop: '4px',
                }} />
              </div>

              <p style={{ color: '#78716c', margin: '0 0 16px', fontSize: '14px' }}>
                has successfully completed all lessons and assessments in
              </p>

              {/* Course title box */}
              <div style={{
                background: '#fff',
                border: `2px solid ${certColor}30`,
                borderRadius: '14px',
                padding: '14px 24px',
                marginBottom: '24px',
                boxShadow: `0 4px 16px ${certColor}15`,
                position: 'relative',
              }}>
                <div style={{
                  position: 'absolute', top: '-11px', left: '50%', transform: 'translateX(-50%)',
                  background: '#fff', padding: '0 8px',
                  fontSize: '16px',
                }}>📚</div>
                <p style={{ margin: 0, fontWeight: '800', fontSize: '18px', color: '#1c1917', lineHeight: 1.3 }}>
                  {completedCourseTitle}
                </p>
              </div>

              {/* Seal row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '20px', marginBottom: '24px' }}>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, transparent, #d4b896)' }} />
                <div style={{
                  width: '56px', height: '56px', borderRadius: '50%',
                  background: certGradient,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  boxShadow: `0 4px 16px ${certColor}50`,
                  border: '3px solid #fff',
                  outline: `2px solid ${certColor}40`,
                  fontSize: '26px',
                }}>⭐</div>
                <div style={{ flex: 1, height: '1px', background: 'linear-gradient(90deg, #d4b896, transparent)' }} />
              </div>

              {/* Date and badge row */}
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '12px', flexWrap: 'wrap', marginBottom: '28px' }}>
                <div style={{
                  background: '#fef9c3', border: '1px solid #fde68a',
                  borderRadius: '999px', padding: '6px 16px',
                  fontSize: '12px', fontWeight: '700', color: '#92400e',
                }}>
                  📅 {completionDate || COMPLETION_DATE}
                </div>
                <div style={{
                  background: `${certColor}15`, border: `1px solid ${certColor}40`,
                  borderRadius: '999px', padding: '6px 16px',
                  fontSize: '12px', fontWeight: '700', color: certColor,
                }}>
                  ✓ Verified Completion
                </div>
              </div>

              <button
                onClick={() => setPage('list')}
                style={{
                  padding: '13px 28px', borderRadius: '14px',
                  border: '2px solid #e7e5e4', background: '#fff',
                  color: '#44403c', fontWeight: '700', cursor: 'pointer',
                  fontSize: '14px', fontFamily: 'inherit',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.07)',
                  transition: 'all 0.2s',
                }}
              >
                ← Back to Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}

const cStyles = {
  container: { padding: '28px 18px 48px', maxWidth: '1100px', margin: '0 auto', fontFamily: "'Inter', system-ui, sans-serif", background: 'linear-gradient(180deg, #eef2ff 0%, #ffffff 60%)', borderRadius: '32px', boxShadow: '0 24px 80px rgba(15,23,42,0.08)' },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px', marginBottom: '28px' },
  headerBadge: { display: 'inline-flex', alignItems: 'center', background: '#fef3c7', color: '#92400e', borderRadius: '999px', padding: '7px 14px', fontSize: '12px', fontWeight: '700', marginBottom: '8px' },
  headerTitle: { margin: '0 0 6px', fontSize: '32px', fontWeight: '900', color: '#111827' },
  headerSub: { margin: 0, color: '#64748b', fontSize: '15px' },
  completedPill: { display: 'flex', alignItems: 'center', gap: '12px', background: 'linear-gradient(135deg,#6366f1,#2563eb)', color: '#fff', borderRadius: '16px', padding: '14px 20px', boxShadow: '0 8px 24px rgba(99,102,241,0.3)' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(290px, 1fr))', gap: '20px' },
  courseCard: { borderRadius: '20px', overflow: 'hidden', boxShadow: '0 12px 32px rgba(15,23,42,0.1)', border: '1px solid rgba(0,0,0,0.06)', display: 'flex', flexDirection: 'column' },
  courseCardTop: { padding: '24px', color: '#fff' },
  courseCardTitle: { margin: '14px 0 6px', fontSize: '20px', fontWeight: '800', color: '#fff', lineHeight: 1.2 },
  courseCardSub: { margin: 0, fontSize: '13px', color: 'rgba(255,255,255,0.8)' },
  courseTierTag: { borderRadius: '999px', padding: '4px 12px', fontSize: '11px', fontWeight: '800', letterSpacing: '0.5px', textTransform: 'uppercase' },
  courseCardBottom: { background: '#fff', padding: '18px', flex: 1 },
  startBtn: { width: '100%', padding: '12px', border: 'none', borderRadius: '12px', fontWeight: '800', fontSize: '14px', cursor: 'pointer', transition: 'opacity 0.2s', fontFamily: 'inherit' },
  innerContainer: { maxWidth: '780px', margin: '0 auto', padding: '0 16px 40px', fontFamily: "'Inter', system-ui, sans-serif" },
  backBtn: { border: 'none', background: 'none', color: '#2563eb', cursor: 'pointer', marginBottom: '16px', fontSize: '14px', fontWeight: '600', padding: 0 },
  courseHeaderBar: { padding: '20px 24px', borderRadius: '18px', marginBottom: '16px', color: '#fff' },
  lessonCard: { background: '#fff', borderRadius: '18px', padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.07)', border: '1px solid #f1f5f9' },
  lessonNumBadge: { display: 'inline-block', color: '#fff', borderRadius: '999px', padding: '4px 14px', fontSize: '12px', fontWeight: '700', marginBottom: '12px', letterSpacing: '0.5px' },
  lessonTitle: { margin: '0 0 18px', fontSize: '22px', fontWeight: '800', color: '#111827' },
  lessonInfoList: { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '24px' },
  lessonInfoItem: { display: 'flex', gap: '12px', alignItems: 'flex-start' },
  lessonInfoDot: { width: '8px', height: '8px', borderRadius: '50%', marginTop: '6px', flexShrink: 0 },
  lessonInfoText: { margin: 0, color: '#334155', fontSize: '15px', lineHeight: '1.7' },
  quizBtn: { padding: '13px 28px', border: 'none', borderRadius: '12px', color: '#fff', fontWeight: '800', fontSize: '15px', cursor: 'pointer', fontFamily: 'inherit' },
  quizHeaderCard: { background: '#fff', borderRadius: '14px', padding: '16px 20px', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  scoreChip: { borderRadius: '999px', padding: '4px 12px', color: '#fff', fontSize: '12px', fontWeight: '700' },
  quizCard: { background: '#fff', borderRadius: '18px', padding: '28px', boxShadow: '0 8px 24px rgba(0,0,0,0.07)' },
  questionNumBadge: { display: 'inline-block', borderRadius: '8px', padding: '4px 10px', fontSize: '12px', fontWeight: '800', marginBottom: '12px' },
  questionText: { fontSize: '17px', fontWeight: '700', color: '#1e293b', marginBottom: '20px', lineHeight: '1.55' },
  choiceBtn: { padding: '14px 16px', textAlign: 'left', border: '2px solid #e2e8f0', borderRadius: '12px', background: '#f8fafc', fontSize: '13px', fontWeight: '500', color: '#334155', display: 'flex', alignItems: 'flex-start', gap: '12px', fontFamily: 'inherit', transition: 'border-color 0.2s', lineHeight: '1.45' },
  choiceLetter: { width: '28px', height: '28px', minWidth: '28px', borderRadius: '8px', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '800', color: '#475569', flexShrink: 0 },
  feedbackBox: { marginTop: '18px', padding: '16px 18px', borderRadius: '14px', border: '2px solid' },
  nextBtn: { padding: '11px 24px', border: 'none', borderRadius: '10px', color: '#fff', fontWeight: '700', cursor: 'pointer', fontSize: '14px', fontFamily: 'inherit' },
  resultCard: { borderRadius: '20px', padding: '32px 24px', textAlign: 'center', marginBottom: '18px', boxShadow: '0 12px 32px rgba(0,0,0,0.15)' },
  scoreDisplay: { margin: '16px 0' },
  scoreCircle: { display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '90px', height: '90px', borderRadius: '50%', background: '#fff', boxShadow: '0 4px 16px rgba(0,0,0,0.15)' },
  wrongAnswersCard: { background: '#fff', borderRadius: '18px', padding: '20px', marginBottom: '16px', boxShadow: '0 4px 12px rgba(0,0,0,0.05)' },
  wrongItem: { padding: '12px', background: '#fef9f9', borderRadius: '10px', marginBottom: '10px', border: '1px solid #fecaca' },
  continueBtn: { width: '100%', padding: '15px', border: 'none', borderRadius: '14px', color: '#fff', fontWeight: '800', fontSize: '16px', cursor: 'pointer', fontFamily: 'inherit' },
  reviewCard: { background: '#fff', borderRadius: '18px', padding: '24px', boxShadow: '0 8px 24px rgba(0,0,0,0.07)' },
  reviewSummary: { textAlign: 'center', marginBottom: '24px', padding: '20px', background: '#f8fafc', borderRadius: '14px' },
  reviewBadge: { display: 'inline-block', background: '#d1fae5', color: '#065f46', borderRadius: '999px', padding: '4px 14px', fontSize: '12px', fontWeight: '700', marginBottom: '8px' },
  reviewScore: { fontSize: '40px', fontWeight: '900', color: '#059669', margin: '4px 0 8px' },
  reviewItem: { marginBottom: '20px', paddingBottom: '20px', borderBottom: '1px solid #f1f5f9' },
  reviewLessonTitle: { fontWeight: '800', color: '#1e293b', fontSize: '15px', marginBottom: '10px' },
  reviewList: { margin: 0, paddingLeft: '20px' },
  reviewListItem: { color: '#475569', fontSize: '14px', lineHeight: '1.7', marginBottom: '6px' },
};
