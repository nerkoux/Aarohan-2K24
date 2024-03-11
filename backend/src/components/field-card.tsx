import { Button } from "@/components/ui/button"
import { Field } from "@prisma/client"
import { ListIcon, TextCursorInputIcon } from "lucide-react"

export const FieldCard = (field: Field) => {
  return (
    <Button variant="outline" className="justify-start gap-x-4 flex-1">
      {field.name}
      {field.type === "SELECT" ? (
        <div className="flex items-center ml-auto">
          <ListIcon className="w-4 h-4" />
          <span className="text-muted-foreground ml-2">
            ({field.options.length})
          </span>
        </div>
      ) : (
        <TextCursorInputIcon className="w-4 h-4 ml-auto" />
      )}
    </Button>
  )
}
