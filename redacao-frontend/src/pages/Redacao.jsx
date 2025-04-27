import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ModeToggle } from "@/components/mode-toggle";
import { DataTable } from "@/components/data-table";
import { columns } from "@/components/columns.jsx";
import { motion, AnimatePresence } from "framer-motion";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import supabase from '../lib/supabaseClient.js'

export default function Redacao() {
  const [alunos, setAlunos] = useState([]);
  const [novoNome, setNovoNome] = useState("");
  const [modalAberta, setModalAberta] = useState(false);
  const [modalCorrecaoAberta, setModalCorrecaoAberta] = useState(false);
  const [alunoSelecionado, setAlunoSelecionado] = useState(null);
  const [indiceSlideAtual, setIndiceSlideAtual] = useState(0);
  const [respostas, setRespostas] = useState(["", "", "", "", ""]);

  // useEffect(() => {
  //   const dadosSalvos = JSON.parse(localStorage.getItem("correcoes")) || [];
  //   setAlunos(dadosSalvos);
  // }, []);

  useEffect(() => {
    async function fetchAlunos() {

      let { data: Alunos, error } = await supabase
        .from('Alunos')
        .select('*')

      console.log(Alunos);
      if (error) {
        console.error('Erro ao buscar alunos:', error);
      } else {
        setAlunos(Alunos);
      }
    }

    fetchAlunos();
  }, []);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!modalCorrecaoAberta) return;

      if (["1", "2", "3", "4", "5"].includes(e.key)) {
        const nivel = parseInt(e.key);
        const valorNivel = nivel * 40;
        const novaRespostas = [...respostas];
        novaRespostas[indiceSlideAtual] = valorNivel;
        setRespostas(novaRespostas);
      }

      if (e.key === "ArrowLeft") {
        setIndiceSlideAtual((i) => Math.max(i - 1, 0));
      }

      if (e.key === "ArrowRight") {
        setIndiceSlideAtual((i) => Math.min(i + 1, 4));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [modalCorrecaoAberta, indiceSlideAtual, respostas]);


  const adicionarAluno = () => {
    if (!novoNome.trim()) return;
    const novoId = alunos.length > 0 ? alunos[alunos.length - 1].id + 1 : 1;
    const novoAluno = { id: novoId, nome: novoNome };
    setAlunos([...alunos, novoAluno]);
    localStorage.setItem("correcoes", JSON.stringify([...alunos, novoAluno]));
    setNovoNome("");
    setModalAberta(false);
  };

  const iniciarCorrecao = (aluno) => {
    setAlunoSelecionado(aluno);
    setIndiceSlideAtual(0);
    setRespostas(["", "", "", "", ""]);
    setModalCorrecaoAberta(true);
  };

  const finalizarCorrecao = () => {
    const novaLinha = `${alunoSelecionado.id},${alunoSelecionado.nome},${respostas.join(",")}`;
    const existentes = localStorage.getItem("csv") || "";
    localStorage.setItem("csv", existentes + novaLinha + "\n");
    setModalCorrecaoAberta(false);
  };

  const baixarCSV = () => {
    const csv = localStorage.getItem("csv") || "";
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.setAttribute("download", "correcoes.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const competencias = [
    "Competência 1",
    "Competência 2",
    "Competência 3",
    "Competência 4",
    "Competência 5",
  ];

  const nota = respostas.reduce((total, valor) => total + (parseInt(valor) || 0), 0);

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6 font-sans">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Correções</h1>
        <ModeToggle />
      </div>

      <div className="flex justify-between items-center">
        <Dialog open={modalAberta} onOpenChange={setModalAberta}>
          <DialogTrigger asChild>
            <Button variant="secondary">+ Adicionar aluno</Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Novo Aluno</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <Label htmlFor="nome">Nome completo</Label>
              <Input id="nome" value={novoNome} onChange={(e) => setNovoNome(e.target.value)} />
              <p className="text-sm text-muted-foreground">ID: {alunos.length > 0 ? alunos[alunos.length - 1].id + 1 : 1}</p>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setModalAberta(false)}>Cancelar</Button>
              <Button variant="default" onClick={adicionarAluno}>Finalizar</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>

        <Button variant="outline" onClick={baixarCSV}>Baixar CSV</Button>
      </div>

      <DataTable
        columns={columns(iniciarCorrecao)}
        data={alunos}
        className="[&_.rdg-cell]:text-left"
      />

      <Dialog open={modalCorrecaoAberta} onOpenChange={setModalCorrecaoAberta}>
        <DialogContent className="max-w-2xl bg-[var(--card)] dark:bg-[var(--card)]">
          <div className="flex justify-between items-center">
            <h2 className="text-xl font-semibold">{alunoSelecionado?.nome}</h2>
            <div className="flex items-center">
              <h3 className="text-lg font-semibold mr-2">Nota:</h3>
              <span
                className={`text-lg font-semibold ${(nota ? nota : 0) <= 600
                  ? "text-red-500"
                  : nota <= 760
                    ? "text-yellow-500"
                    : "text-green-500"
                  }`}
              >
                {nota}
              </span>
            </div>
          </div>
          <AnimatePresence mode="wait">
            <motion.div
              key={indiceSlideAtual}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="p-4 bg-[var(--card)] dark:bg-[var(--card)] rounded-lg shadow"
            >
              <h3 className="font-semibold mb-2">{competencias[indiceSlideAtual]}</h3>
              <RadioGroup
                value={respostas[indiceSlideAtual]}
                onValueChange={(valor) => {
                  const novaRespostas = [...respostas];
                  novaRespostas[indiceSlideAtual] = parseInt(valor);
                  setRespostas(novaRespostas);
                }}
                className="space-y-2"
              >
                {[1, 2, 3, 4, 5].map((nivel) => {
                  const valorNivel = nivel * 40;
                  return (
                    <div key={valorNivel} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={valorNivel}
                        id={`comp${indiceSlideAtual}-nivel-${nivel}`}
                      />
                      <label
                        htmlFor={`comp${indiceSlideAtual}-nivel-${nivel}`}
                        className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                      >
                        {valorNivel}
                      </label>
                    </div>
                  );
                })}
              </RadioGroup>
              <div className="flex justify-between mt-4">
                <Button
                  variant="outline"
                  onClick={() => setIndiceSlideAtual((i) => Math.max(i - 1, 0))}
                  disabled={indiceSlideAtual === 0}
                >
                  Voltar
                </Button>
                {indiceSlideAtual === 4 ? (
                  <Button variant="default" onClick={finalizarCorrecao}>Finalizar correção</Button>
                ) : (
                  <Button variant="default" onClick={() => setIndiceSlideAtual((i) => i + 1)}>Avançar</Button>
                )}
              </div>
            </motion.div>
          </AnimatePresence>
        </DialogContent>
      </Dialog>

    </div>
  );
}
