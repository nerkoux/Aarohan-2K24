import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { makeRequest } from "@/lib/axios"
import { ApiError } from "@/types/axios"
import { yupResolver } from "@hookform/resolvers/yup"
import { useMutation, useQueryClient } from "@tanstack/react-query"
import { AxiosError } from "axios"
import { Loader2Icon, PlusIcon, X } from "lucide-react"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as y from "yup"

const schema = y.object({
  name: y.string().required("Name is required"),
  value: y.string().required("Value is required"),
  placeholder: y.string(),
  regex: y.string(),
  type: y.string().required("Type is required"),
  options: y.array(
    y.object({
      label: y.string().required("Label is required"),
      value: y.string().required("Value is required"),
    })
  ),
})

interface FieldFormProps {
  onSuccess?: () => void
}

export const FieldForm = (props: FieldFormProps) => {
  const form = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      options: [],
    },
  })

  const options = useFieldArray({
    control: form.control,
    name: "options",
  })

  const queryClient = useQueryClient()

  const createFieldMutation = useMutation({
    mutationKey: ["@CREATE_FIELD"],
    async mutationFn(values: y.InferType<typeof schema>) {
      const res = await makeRequest.post("/fields", values)
      return res.data
    },
    onSuccess() {
      queryClient.invalidateQueries({
        queryKey: ["@FIELDS"],
      })
      toast.success("Field created successfully!")
      props.onSuccess && props.onSuccess()
    },
    onError(error: AxiosError<ApiError>) {
      toast.error(error.response?.data.error)
    },
  })

  const onSubmit = form.handleSubmit((data) => {
    /* Select len check */
    if (options.fields.length <= 0 && data.type === "SELECT") {
      return form.setError("options", {
        type: "manual",
        message: "Please add at least one option.",
      })
    }
    createFieldMutation.mutate(data)
  })

  return (
    <Form {...form}>
      <form className="grid grid-cols-2 gap-4" onSubmit={onSubmit}>
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="Field name" {...field} />
              </FormControl>
              <FormDescription>This is label for the field.</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="value"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Value</FormLabel>
              <FormControl>
                <Input placeholder="Field value" {...field} />
              </FormControl>
              <FormDescription>
                This will be the key for storage
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="regex"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Regex</FormLabel>
              <FormControl>
                <Input placeholder="Field regex" {...field} />
              </FormControl>
              <FormDescription>
                Share the regex you want to validate with.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="placeholder"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Placeholder</FormLabel>
              <FormControl>
                <Input placeholder="Field placeholder" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Type</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a field type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="TEXT">TEXT</SelectItem>
                    <SelectItem value="SELECT">SELECT</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {form.watch("type") === "SELECT" && (
          <div className="space-y-4">
            <div className="flex flex-col gap-y-4">
              <Label>Options</Label>
              {options.fields.map((field, index) => (
                <div key={field.id} className="flex gap-x-4">
                  <FormField
                    control={form.control}
                    name={`options.${index}.label`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input placeholder="Option label" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name={`options.${index}.value`}
                    render={({ field }) => (
                      <FormItem className="flex-grow">
                        <FormControl>
                          <Input placeholder="Option value" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    className="shrink-0"
                    onClick={() => options.remove(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {form.formState.errors.options?.message && (
                <p className="text-sm font-medium text-destructive">
                  {form.formState.errors.options?.message}
                </p>
              )}
            </div>
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={() =>
                options.append({
                  label: "",
                  value: "",
                })
              }>
              <PlusIcon className="w-4 h-4 mr-2" />
              Add
            </Button>
          </div>
        )}
        <Button className="col-span-2" disabled={createFieldMutation.isPending}>
          {createFieldMutation.isPending && (
            <Loader2Icon className="w-4 h-5 animate-spin mr-2" />
          )}
          Create Field
        </Button>
      </form>
    </Form>
  )
}
