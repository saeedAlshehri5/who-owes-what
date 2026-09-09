import { useState } from "react";

function ExpenseForm({
  friends,
  onSaveExpense,
  initialExpense = null,
  onCancel,
  t,
}) {
  const [description, setDescription] = useState(
    initialExpense?.description ?? ""
  );

  const [amount, setAmount] = useState(
    initialExpense
      ? (initialExpense.amountInHalalas / 100).toFixed(2)
      : ""
  );

  const [payerId, setPayerId] = useState(
    initialExpense?.payerId ?? ""
  );

  const [participantIds, setParticipantIds] = useState(
    initialExpense?.participantIds ?? []
  );

  const [errorKey, setErrorKey] = useState("");

  function toggleParticipant(friendId) {
    setParticipantIds((current) =>
      current.includes(friendId)
        ? current.filter((id) => id !== friendId)
        : [...current, friendId]
    );

    setErrorKey("");
  }

  function handleSubmit(event) {
    event.preventDefault();

    const cleanDescription = description.trim();
    const amountInHalalas = Math.round(Number(amount) * 100);

    if (!cleanDescription) {
      setErrorKey("missingDescription");
      return;
    }

    if (
      !Number.isSafeInteger(amountInHalalas) ||
      amountInHalalas <= 0
    ) {
      setErrorKey("invalidAmount");
      return;
    }

    if (!friends.some((friend) => friend.id === payerId)) {
      setErrorKey("missingPayer");
      return;
    }

    if (participantIds.length === 0) {
      setErrorKey("missingParticipants");
      return;
    }

    onSaveExpense({
      id: initialExpense?.id ?? crypto.randomUUID(),
      description: cleanDescription,
      amountInHalalas,
      payerId,
      participantIds: [...participantIds],
    });

    setDescription("");
    setAmount("");
    setPayerId("");
    setParticipantIds([]);
    setErrorKey("");
  }

  if (friends.length < 2) {
    return <p className="empty-state">{t.minimumFriends}</p>;
  }

  return (
    <form className="expense-form" onSubmit={handleSubmit}>
      <div className="form-field">
        <label htmlFor="expense-description">{t.description}</label>

        <input
          id="expense-description"
          type="text"
          dir="auto"
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder={t.descriptionPlaceholder}
          maxLength={100}
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="expense-amount">{t.amount}</label>

        <input
          id="expense-amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(event) => setAmount(event.target.value)}
          placeholder="120.00"
          required
        />
      </div>

      <div className="form-field">
        <label htmlFor="expense-payer">{t.payer}</label>

        <select
          id="expense-payer"
          value={payerId}
          onChange={(event) => setPayerId(event.target.value)}
          required
        >
          <option value="">{t.chooseFriend}</option>

          {friends.map((friend) => (
            <option key={friend.id} value={friend.id}>
              {friend.name}
            </option>
          ))}
        </select>
      </div>

      <fieldset className="participants">
        <legend>{t.participants}</legend>
        <p className="field-hint">{t.participantsHint}</p>

        {friends.map((friend) => (
          <label key={friend.id} className="checkbox-label">
            <input
              type="checkbox"
              checked={participantIds.includes(friend.id)}
              onChange={() => toggleParticipant(friend.id)}
            />
            <bdi>{friend.name}</bdi>
          </label>
        ))}
      </fieldset>

      {errorKey && (
        <p className="error" role="alert">
          {t[errorKey]}
        </p>
      )}

      <div className="form-actions">
        <button className="primary-button" type="submit">
          {initialExpense ? t.saveChanges : t.addExpense}
        </button>

        {initialExpense && (
          <button
            className="secondary-button"
            type="button"
            onClick={onCancel}
          >
            {t.cancel}
          </button>
        )}
      </div>
    </form>
  );
}

export default ExpenseForm;