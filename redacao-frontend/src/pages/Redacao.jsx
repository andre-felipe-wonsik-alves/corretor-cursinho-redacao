import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

const competencias = [
  "Competência 1",
  "Competência 2",
  "Competência 3",
  "Competência 4",
  "Competência 5",
];

export default function Redacao() {
  const [texto, setTexto] = useState("");
  const [notas, setNotas] = useState(null);

  function enviarRedacao() {
    // Aqui futuramente vamos enviar pro backend
    // Por enquanto simula notas aleatórias de 0 a 200
    const notasFalsas = Array.from({ length: 5 }, () =>
      Math.floor(Math.random() * 201)
    );
    setNotas(notasFalsas);
  }

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Redação do ENEM</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Textarea
            placeholder="Digite ou cole sua redação aqui..."
            className="h-60"
            value={texto}
            onChange={(e) => setTexto(e.target.value)}
          />
          <Button onClick={enviarRedacao}>Enviar redação</Button>
        </CardContent>
      </Card>

      {notas && (
        <Card>
          <CardHeader>
            <CardTitle>Resultado da correção</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-2">
            {notas.map((nota, i) => (
              <div
                key={i}
                className="flex justify-between items-center border-b pb-1"
              >
                <span>{competencias[i]}</span>
                <span className="font-bold">{nota} / 200</span>
              </div>
            ))}
            <div className="text-right font-semibold text-lg pt-2 border-t">
              Total: {notas.reduce((a, b) => a + b, 0)} / 1000
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
