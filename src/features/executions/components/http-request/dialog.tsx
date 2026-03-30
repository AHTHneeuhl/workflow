"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSeparator,
  FieldSet,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";

const METHODS = ["GET", "POST", "PUT", "PATCH", "DELETE"] as const;

const formSchema = z.object({
  endpoint: z.url({ message: "Please enter a valid URL" }),
  method: z.enum(METHODS),
  body: z.string().optional(),
});

export type HttpRequestFormValues = z.infer<typeof formSchema>;

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (values: HttpRequestFormValues) => void;
  defaultValues?: Partial<HttpRequestFormValues>;
}

export const HttpRequestDialog = ({
  open,
  onOpenChange,
  onSubmit,
  defaultValues = {},
}: Props) => {
  const form = useForm<HttpRequestFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      endpoint: defaultValues.endpoint || "",
      method: defaultValues.method || "GET",
      body: defaultValues.body || "",
    },
  });

  useEffect(() => {
    if (open) {
      form.reset({
        endpoint: defaultValues.endpoint || "",
        method: defaultValues.method || "GET",
        body: defaultValues.body || "",
      });
    }
  }, [open, defaultValues, form]);

  const watchMethod = form.watch("method");
  const showBodyField = ["POST", "PUT", "PATCH"].includes(watchMethod);

  const handleSubmit = (values: HttpRequestFormValues) => {
    onSubmit(values);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>HTTP Request</DialogTitle>
          <DialogDescription>
            Configure settings for the HTTP Request node.
          </DialogDescription>
        </DialogHeader>

        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-6 mt-4"
        >
          <FieldSet>
            <FieldLegend>Request Configuration</FieldLegend>

            <FieldGroup>
              {/* METHOD */}
              <Field>
                <FieldLabel>Method</FieldLabel>

                <Select
                  onValueChange={(value) =>
                    form.setValue(
                      "method",
                      value as HttpRequestFormValues["method"],
                    )
                  }
                  defaultValue={form.getValues("method")}
                >
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a method" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="GET">GET</SelectItem>
                    <SelectItem value="POST">POST</SelectItem>
                    <SelectItem value="PUT">PUT</SelectItem>
                    <SelectItem value="PATCH">PATCH</SelectItem>
                    <SelectItem value="DELETE">DELETE</SelectItem>
                  </SelectContent>
                </Select>

                <FieldDescription>
                  The HTTP method to use for this request
                </FieldDescription>

                {form.formState.errors.method && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.method.message}
                  </p>
                )}
              </Field>

              <FieldSeparator />

              {/* ENDPOINT */}
              <Field>
                <FieldLabel>Endpoint URL</FieldLabel>

                <Input
                  placeholder="https://api.example.com/users/{{httpResponse.data.id}}"
                  {...form.register("endpoint")}
                />

                <FieldDescription>
                  Static URL or use {"{{variables}}"} or {"{{json variable}}"}
                </FieldDescription>

                {form.formState.errors.endpoint && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.endpoint.message}
                  </p>
                )}
              </Field>

              {/* BODY */}
              {showBodyField && (
                <>
                  <FieldSeparator />

                  <Field>
                    <FieldLabel>Request Body</FieldLabel>

                    <Textarea
                      placeholder={
                        '{\n  "userId": "{{httpResponse.data.id}}",\n  "name": "{{httpResponse.data.name}}",\n  "items": "{{httpResponse.data.items}}"\n}'
                      }
                      className="min-h-[120px] font-mono text-sm"
                      {...form.register("body")}
                    />

                    <FieldDescription>
                      JSON with template variables
                    </FieldDescription>

                    {form.formState.errors.body && (
                      <p className="text-sm text-red-500">
                        {form.formState.errors.body.message}
                      </p>
                    )}
                  </Field>
                </>
              )}
            </FieldGroup>
          </FieldSet>

          <DialogFooter>
            <Button type="submit">Save</Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
