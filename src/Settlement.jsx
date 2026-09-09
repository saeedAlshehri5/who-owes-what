import { calculateSettlement } from "./settlement";

function Settlement({ friends, expenses, language, t }) {
  const { totalInHalalas, people, payments } =
    calculateSettlement(friends, expenses);

  const formatter = new Intl.NumberFormat(
    language === "ar" ? "ar-SA" : "en-SA",
    {
      style: "currency",
      currency: "SAR",
    }
  );

  function formatMoney(amountInHalalas) {
    return formatter.format(amountInHalalas / 100);
  }

  const names = new Map(
    friends.map((friend) => [friend.id, friend.name])
  );

  if (expenses.length === 0) {
    return <p className="empty-state">{t.noSettlement}</p>;
  }

  return (
    <div className="settlement">
      <div className="settlement-total">
        <span>{t.totalSpent}</span>
        <strong>
          <bdi>{formatMoney(totalInHalalas)}</bdi>
        </strong>
      </div>

      <h3 className="settlement-subtitle">
        {t.balancesTitle}
      </h3>

      <ul className="balance-list">
        {people.map((person) => {
          const balance = person.balanceInHalalas;

          const status =
            balance > 0
              ? "positive"
              : balance < 0
                ? "negative"
                : "neutral";

          return (
            <li key={person.id} className="balance-row">
              <bdi className="balance-name">{person.name}</bdi>

              <span className={`balance-value ${status}`}>
                {balance === 0 ? (
                  t.balanced
                ) : (
                  <>
                    <span>
                      {balance > 0 ? t.receives : t.owes}
                    </span>
                    <bdi>{formatMoney(Math.abs(balance))}</bdi>
                  </>
                )}
              </span>
            </li>
          );
        })}
      </ul>

      <h3 className="settlement-subtitle">
        {t.paymentsTitle}
      </h3>

      {payments.length === 0 ? (
        <p className="settlement-success">{t.allBalanced}</p>
      ) : (
        <ul className="payment-list">
          {payments.map((payment) => (
            <li
              key={`${payment.fromId}-${payment.toId}`}
              className="payment-item"
            >
              <div className="payment-people">
                <bdi>{names.get(payment.fromId)}</bdi>
                <span className="payment-verb">{t.pays}</span>
                <bdi>{names.get(payment.toId)}</bdi>
              </div>

              <strong className="payment-amount">
                <bdi>{formatMoney(payment.amountInHalalas)}</bdi>
              </strong>
            </li>
          ))}
        </ul>
      )}

      <p className="settlement-note">{t.settlementHint}</p>
      <p className="settlement-note">{t.roundingHint}</p>
    </div>
  );
}

export default Settlement;