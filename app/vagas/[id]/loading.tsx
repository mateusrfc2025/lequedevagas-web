export default function Loading() {
  return (
    <article className="vaga">
      {/* Esqueleto do título da vaga */}
      <div className="skeleton" style={{ height: "40px", width: "70%", marginBottom: "16px" }} />

      {/* Esqueleto da linha com empresa, área e local */}
      <div className="skeleton" style={{ height: "20px", width: "50%", marginBottom: "32px" }} />

      {/* Esqueleto do botão de copiar link */}
      <div className="skeleton" style={{ height: "36px", width: "150px", marginBottom: "32px", borderRadius: "20px" }} />

      {/* Esqueleto simulando os parágrafos de descrição */}
      <div className="skeleton" style={{ height: "20px", width: "100%", marginBottom: "8px" }} />
      <div className="skeleton" style={{ height: "20px", width: "100%", marginBottom: "8px" }} />
      <div className="skeleton" style={{ height: "20px", width: "80%", marginBottom: "40px" }} />

      {/* Esqueleto do título de candidatura */}
      <div className="skeleton" style={{ height: "32px", width: "40%", marginBottom: "16px" }} />

      {/* Esqueleto gigante do formulário de candidatura */}
      <div className="skeleton" style={{ height: "350px", width: "100%", borderRadius: "8px" }} />
    </article>
  );
}