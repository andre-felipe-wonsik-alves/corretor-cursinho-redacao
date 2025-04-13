import { Button } from "@/components/ui/button";

export const columns = (onCorrigir) => [
  {
    accessorKey: "id",
    header: "ID",
    cell: ({ row }) => <div>{row.getValue("id")}</div>,
  },
  {
    accessorKey: "nome",
    header: "Nome",
    cell: ({ row }) => <div>{row.getValue("nome")}</div>,
  },
  {
    id: "actions",
    header: "Ações",
    cell: ({ row }) => {
      const aluno = row.original;

      return (
        <Button variant="outline" size="sm" onClick={() => onCorrigir(aluno)}>
          Iniciar correção
        </Button>
      );
    },
  },
];
