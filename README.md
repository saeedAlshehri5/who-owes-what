# Who Owes What? | مين يدفع لمين؟

A bilingual expense-splitting app that helps friends track shared costs and see who needs to pay whom.

Built with React, Vite, and CSS, with English and Arabic interfaces and a responsive layout.

## Features

- Add friends with validation for empty and duplicate names.
- Record expenses with a description, amount, payer, and selected participants.
- Split each expense equally among its participants.
- Edit and delete expenses.
- View total spending, individual balances, and suggested repayments.
- Switch between English and Arabic with right-to-left layout support.
- Use the app on desktop, tablet, or mobile.

## Example

Three friends share dinner and coffee:

| Person | Paid | Share | Balance |
| --- | ---: | ---: | --- |
| You | 120 SAR | 60 SAR | Receives 60 SAR |
| Omar | 60 SAR | 60 SAR | Balanced |
| Ali | 0 SAR | 60 SAR | Owes 60 SAR |

The app suggests: **Ali pays you 60 SAR.**

“Balanced” means the person paid exactly their share and has a net balance of zero.

## Getting started

Install Node.js and npm, then open a terminal in the project folder.

```bash
npm install
npm run dev
```

Open the local URL displayed in the terminal.

To create a production build:

```bash
npm run build
```

To preview that build locally:

```bash
npm run preview
```

## How to use

1. Add yourself and your friends.
2. Enter an expense description and amount in SAR.
3. Choose who paid.
4. Select everyone who shared the expense, including the payer if applicable.
5. Add the expense and review the settlement suggestions.
6. Edit or delete expenses as needed; balances update automatically.

## How settlement works

For each person:

```text
Balance = Total paid − Total share of expenses
```

A positive balance means the person should receive money. A negative balance means they owe money. The app matches people who owe money with people who should receive it to produce a valid settlement plan; it does not guarantee the fewest possible transfers.

Amounts are stored in whole halalas. When an expense does not divide evenly, extra halalas are assigned to selected participants in friends-list order. For example, 10 SAR split among three people becomes 3.34, 3.33, and 3.33 SAR.

## Project structure

```text
src/
├── main.jsx          # React entry point
├── App.jsx           # Main page and shared state
├── ExpenseForm.jsx   # Add and edit expenses
├── Settlement.jsx    # Balances and payment suggestions
├── settlement.js     # Expense-splitting calculations
├── translations.js   # English and Arabic text
├── index.css         # Global styles
└── App.css           # App layout and component styles
```

## Current limitations

- Data is held in memory and resets when the page is refreshed or closed.
- Currency is SAR only.
- Expenses are split equally among selected participants.
- Groups are managed on one device; there is no shared editing or backend.
- Suggested payments do not record or transfer real money.
- Browser-generated form validation messages follow browser language settings.

## Roadmap

- [ ] Save expenses, friends, and language preference in browser storage.
- [ ] Copy a settlement summary for sharing.
- [ ] Track repayments.
- [ ] Support multiple outings.
- [ ] Support unequal splits.

## Versioning

The initial release is planned as **v1.0.0**. Future releases will use Git tags and GitHub releases to document changes.

- Patch releases, such as `v1.0.1`: bug fixes.
- Minor releases, such as `v1.1.0`: compatible new features.
- Major releases, such as `v2.0.0`: breaking changes.