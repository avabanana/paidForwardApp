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
            <button onClick={() => { localStorage.setItem('storage_preference', 'supabase'); setStoragePref('supabase'); }} style={{ ...cStyles.quizBtn, background: '#0056D2' }}>Synchronize with Account</button>
            <button onClick={() => { localStorage.setItem('storage_preference', 'local'); setStoragePref('local'); }} style={{ ...cStyles.quizBtn, background: '#64748b' }}>Store Locally Only</button>
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
                <div style={{ ...cStyles.courseCardTop, background: isElementary ? c.gradient : '#fff', padding: '20px', borderBottom: isElementary ? 'none' : '1px solid #e2e8f0' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <span style={{ fontSize: '32px' }}>{c.emoji}</span>
                    <span style={{ ...cStyles.courseTierTag, background: isElementary ? 'rgba(255,255,255,0.25)' : '#eef2ff', color: isElementary ? '#fff' : '#0056D2' }}>{c.tag}</span>
                  </div>
                  <h3 style={{...cStyles.courseCardTitle, color: isElementary ? '#fff' : '#1e293b'}}>{c.title}</h3>
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
              <div key={idx} style={{...cStyles.syllabusItem, borderLeft: isDone ? '4px solid #22c55e' : '4px solid #e2e8f0'}}>
                <div style={{flex: 1}}>
                  <div style={{fontSize: '12px', color: '#64748b', textTransform: 'uppercase', fontWeight: '700'}}>Module {idx + 1}</div>
                  <div style={{fontWeight: '700', fontSize: '16px'}}>{les.title}</div>
                </div>
                <button 
                  onClick={() => { setCurrentLesson(idx); setPage('lesson'); }}
                  style={{...cStyles.syllabusBtn, background: isDone ? '#f0fdf4' : '#0056D2', color: isDone ? '#166534' : '#fff'}}
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

            <div style={{marginTop: '40px', padding: '30px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0'}}>
              <h4 style={{margin: '0 0 10px 0'}}>Ready for the module quiz?</h4>
              <p style={{fontSize: '14px', color: '#64748b', marginBottom: '20px'}}>Pass with 70% or higher to complete this module.</p>
              <button onClick={handleBeginQuiz} style={{ ...cStyles.quizBtn, background: isElementary ? course.gradient : '#0056D2', width: isElementary ? '100%' : 'auto' }}>
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
        <button onClick={handleContinueAfterResult} style={{ ...cStyles.continueBtn, background: result.passed ? '#0056D2' : '#1e293b', borderRadius: '4px' }}>
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
          background: `linear-gradient(45deg, #d4af37, #f1c40f, #d4af37)`,
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
        <div style={{ ...cStyles.courseHeaderBar, background: course.gradient }}>
          <h2 style={{ margin: 0, color: '#fff', fontSize: '24px' }}>Review: {course.title}</h2>
        </div>
        <div style={cStyles.reviewCard}>
          {course.lessons.map((les, idx) => (
            <div key={idx} style={cStyles.reviewItem}>
              <div style={cStyles.reviewLessonTitle}>{les.title}</div>
              <ul style={cStyles.reviewList}>{les.info.map((line, i) => <li key={i} style={cStyles.reviewListItem}>{line}</li>)}</ul>
            </div>
          ))}
          <button onClick={() => setPage('list')} style={{ ...cStyles.continueBtn, background: course.gradient }}>Done</button>
        </div>
      </div>
    );
  }

  return null;
}

const cStyles = {
  container: { padding: '40px 20px 80px', maxWidth: '1200px', margin: '0 auto', fontFamily: "'Inter', sans-serif" },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '40px', flexWrap: 'wrap', gap: '20px' },
  headerTitle: { margin: 0, fontSize: '28px', fontWeight: '800', color: '#1e293b' },
  headerSub: { margin: '4px 0 0', color: '#64748b', fontSize: '16px' },
  completedPill: { display: 'flex', alignItems: 'center', gap: '15px', borderRadius: '8px', padding: '12px 20px' },
  grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '24px' },
  courseCard: { display: 'flex', flexDirection: 'column', overflow: 'hidden', border: '1px solid #e2e8f0', transition: 'transform 0.2s' },
  courseCardTop: { position: 'relative' },
  courseCardTitle: { margin: '12px 0 0', fontSize: '18px', fontWeight: '700', lineHeight: '1.4' },
  courseTierTag: { fontSize: '10px', fontWeight: '800', textTransform: 'uppercase', padding: '4px 8px', borderRadius: '4px' },
  courseCardBottom: { background: '#fff', padding: '20px', flex: 1 },
  startBtn: { width: '100%', padding: '12px', border: 'none', borderRadius: '4px', fontWeight: '700', fontSize: '14px', cursor: 'pointer' },
  innerContainer: { maxWidth: '900px', margin: '0 auto', padding: '40px 20px' },
  backBtn: { border: 'none', background: 'none', color: '#0056D2', cursor: 'pointer', marginBottom: '20px', fontSize: '14px', fontWeight: '600', padding: 0 },
  syllabusHeader: { padding: '40px', borderRadius: '8px', marginBottom: '30px', textAlign: 'center' },
  syllabusContainer: { background: '#fff', padding: '20px' },
  syllabusItem: { display: 'flex', alignItems: 'center', padding: '20px', background: '#fff', border: '1px solid #e2e8f0', marginBottom: '10px', borderRadius: '4px' },
  syllabusBtn: { padding: '8px 16px', border: 'none', borderRadius: '4px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' },
  learningEnv: { display: 'flex', minHeight: '100vh', background: '#fff' },
  sidebar: { width: '300px', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', position: 'sticky', top: 0, height: '100vh' },
  lessonMainContent: { flex: 1, overflowY: 'auto' },
  courseraArticle: { fontFamily: 'Georgia, serif' },
  quizHeaderCard: { padding: '10px 0', marginBottom: '20px' },
  quizCard: { background: '#fff', padding: '40px', borderRadius: '8px' },
  choiceBtn: { width: '100%', padding: '16px', textAlign: 'left', border: '1px solid #e2e8f0', borderRadius: '8px', marginBottom: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '15px', fontSize: '15px', fontFamily: 'inherit' },
  choiceLetter: { width: '30px', height: '30px', borderRadius: '50%', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '12px', fontWeight: '700' },
  feedbackBox: { marginTop: '20px', padding: '20px', border: '1px solid' },
  nextBtn: { padding: '12px 24px', border: 'none', borderRadius: '4px', color: '#fff', fontWeight: '700', cursor: 'pointer' },
  resultCard: { padding: '60px', textAlign: 'center', marginBottom: '20px', borderRadius: '8px' },
  scoreDisplay: { margin: '30px 0' },
  continueBtn: { width: '100%', padding: '16px', border: 'none', borderRadius: '4px', color: '#fff', fontWeight: '700', fontSize: '16px', cursor: 'pointer' },
  reviewCard: { background: '#fff', padding: '30px', border: '1px solid #e2e8f0' },
  reviewItem: { marginBottom: '30px' },
  reviewLessonTitle: { fontWeight: '800', fontSize: '18px', marginBottom: '15px' },
  reviewList: { paddingLeft: '20px' },
  reviewListItem: { marginBottom: '10px', color: '#475569' },
  lessonCard: { background: '#fff', padding: '40px', borderRadius: '8px', textAlign: 'center', border: '1px solid #e2e8f0' },
  lessonTitle: { fontSize: '24px', fontWeight: '800', marginBottom: '10px' },
  lessonInfoText: { color: '#64748b' },
  quizBtn: { padding: '12px 24px', border: 'none', borderRadius: '4px', color: '#fff', fontWeight: '700', cursor: 'pointer' }
};