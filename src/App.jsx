import { useEffect, useState } from "react";
import ExpenseForm from "./ExpenseForm";
import Settlement from "./Settlement.jsx";
import translations from "./translations";
import "./App.css";

function App() {
  const [language, setLanguage] = useState("en");
  const [friends, setFriends] = useState([]);
  const [friendName, setFriendName] = useState("");
  const [errorKey, setErrorKey] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [editingExpenseId, setEditingExpenseId] = useState(null);

  const t = translations[language];

  useEffect(() => {
    document.documentElement.lang = language;
    document.documentElement.dir = translations[language].direction;
    document.title = translations[language].title;
  }, [language]);

  const editingExpense =
    expenses.find((expense) => expense.id === editingExpenseId) ?? null;

  const currencyFormatter = new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-SA",
    {
      style: "currency",
      currency: "SAR",
    }
  );

  function handleAddFriend(event) {
    event.preventDefault();

    const name = friendName.trim();

    if (!name) {
      setErrorKey("emptyName");
      return;
    }

    const nameExists = friends.some(
      (friend) => friend.name.toLowerCase() === name.toLowerCase()
    );

    if (nameExists) {
      setErrorKey("duplicateName");
      return;
    }

    setFriends((current) => [
      ...current,
      {
        id: crypto.randomUUID(),
        name,
      },
    ]);

    setFriendName("");
    setErrorKey("");
  }

  function handleSaveExpense(savedExpense) {
    setExpenses((current) => {
      const alreadyExists = current.some(
        (expense) => expense.id === savedExpense.id
      );

      if (alreadyExists) {
        return current.map((expense) =>
          expense.id === savedExpense.id ? savedExpense : expense
        );
      }

      return [...current, savedExpense];
    });

    setEditingExpenseId(null);
  }

  function handleDeleteExpense(expenseId) {
    if (!window.confirm(t.deleteConfirmation)) {
      return;
    }

    setExpenses((current) =>
      current.filter((expense) => expense.id !== expenseId)
    );

    if (editingExpenseId === expenseId) {
      setEditingExpenseId(null);
    }
  }

  return (
    <main className="app" dir={t.direction} lang={language}>
      <header className="app-header">
        <div className="header-top">
          <span className="eyebrow">{t.eyebrow}</span>

          <button
            className="language-button"
            type="button"
            onClick={() =>
              setLanguage((current) => (current === "en" ? "ar" : "en"))
            }
            aria-label={t.switchLabel}
          >
            <span lang={language === "en" ? "ar" : "en"}>
              {t.switchLanguage}
            </span>
          </button>
        </div>

        <h1>{t.title}</h1>
        <p>{t.subtitle}</p>
      </header>

      <section className="card friends-card">
        <h2>{t.friends}</h2>
        <p>{t.friendsDescription}</p>

        <form onSubmit={handleAddFriend} className="friend-form">
          <label htmlFor="friend-name">{t.friendName}</label>

          <div className="input-row">
            <input
              id="friend-name"
              type="text"
              dir="auto"
              placeholder={t.friendPlaceholder}
              value={friendName}
              onChange={(event) => {
                setFriendName(event.target.value);
                setErrorKey("");
              }}
              maxLength={40}
              aria-invalid={Boolean(errorKey)}
              aria-describedby={errorKey ? "friend-error" : undefined}
            />

            <button className="primary-button" type="submit">
              {t.addFriend}
            </button>
          </div>

          {errorKey && (
            <p id="friend-error" className="error" role="alert">
              {t[errorKey]}
            </p>
          )}
        </form>

        {friends.length === 0 ? (
          <p className="empty-state">{t.noFriends}</p>
        ) : (
          <ul className="friend-list">
            {friends.map((friend) => (
              <li key={friend.id} className="friend-chip">
                <bdi>{friend.name}</bdi>
              </li>
            ))}
          </ul>
        )}
      </section>

      <section className="card expenses-card">
        <h2>{editingExpense ? t.editExpense : t.expenses}</h2>
        <p>{t.expensesDescription}</p>

        <ExpenseForm
          key={editingExpenseId ?? "new"}
          friends={friends}
          onSaveExpense={handleSaveExpense}
          initialExpense={editingExpense}
          onCancel={() => setEditingExpenseId(null)}
          t={t}
        />

        {expenses.length === 0 ? (
          <p className="empty-state">{t.noExpenses}</p>
        ) : (
          <ul className="expense-list">
            {expenses.map((expense) => {
              const payer = friends.find(
                (friend) => friend.id === expense.payerId
              );

              const participants = friends.filter((friend) =>
                expense.participantIds.includes(friend.id)
              );

              return (
                <li key={expense.id} className="expense-item">
                  <div className="expense-heading">
                    <h3>
                      <bdi>{expense.description}</bdi>
                    </h3>

                    <strong>
                      <bdi>
                        {currencyFormatter.format(
                          expense.amountInHalalas / 100
                        )}
                      </bdi>
                    </strong>
                  </div>

                  <p>
                    {t.paidBy}: <bdi>{payer?.name ?? t.unknown}</bdi>
                  </p>

                  <p>
                    {t.sharedBy}:{" "}
                    {participants.map((friend, index) => (
                      <span key={friend.id}>
                        {index > 0 && (language === "ar" ? "، " : ", ")}
                        <bdi>{friend.name}</bdi>
                      </span>
                    ))}
                  </p>

                  <div className="expense-actions">
                    <button
                      className="secondary-button"
                      type="button"
                      onClick={() => setEditingExpenseId(expense.id)}
                      aria-label={`${t.edit}: ${expense.description}`}
                    >
                      {t.edit}
                    </button>

                    <button
                      className="danger-button"
                      type="button"
                      onClick={() => handleDeleteExpense(expense.id)}
                      aria-label={`${t.delete}: ${expense.description}`}
                    >
                      {t.delete}
                    </button>
                  </div>
                </li>
              );
            })}
          </ul>
        )}
      </section>

      <section className="card settlement-card">
        <h2>{t.settleUp}</h2>

        <Settlement
          friends={friends}
          expenses={expenses}
          language={language}
          t={t}
        />
      </section>
    </main>
  );
}

export default App;