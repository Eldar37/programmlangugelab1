function StateBox({ title, text, type = 'default', action }) {
  return (
    <section className={`state-box state-box--${type}`}>
      <h2 className="state-box__title">{title}</h2>
      {text && <p className="state-box__text">{text}</p>}
      {action && <div className="button-row" style={{ marginTop: 14 }}>{action}</div>}
    </section>
  );
}

export default StateBox;
