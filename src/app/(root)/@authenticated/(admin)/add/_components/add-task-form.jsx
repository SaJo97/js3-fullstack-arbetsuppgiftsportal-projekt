"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { eachDayOfInterval, parse } from "date-fns";
import { useEffect, useState } from "react";
import { useUsers } from "@/context/usersContext";

import { Check, ChevronsUpDown } from "lucide-react";

import { cn } from "@/lib/utils";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useTasks } from "@/context/tasksContext";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "@/lib/firebase";

// Base schema for task validation
const base = z.object({
  title: z.string().nonempty({ message: "Uppgift är obligatorisk" }),
  ownerId: z.string().nonempty({ message: "Du måste välja en användare" }),
});
// Schema for a single task
const single = base.extend({
  reoccuring: z.literal("none"),
  date: z.date(),
});
// Schema for multiple tasks
const multiple = base.extend({
  reoccuring: z.literal("multiple"),
  dateMultiple: z.array(z.date()).min(1, "Välj minst ett datum"),
});
// Schema for a range of tasks
const range = base.extend({
  reoccuring: z.literal("range"),
  dateRange: z.object({
    from: z.date(),
    to: z.date(),
  }),
});

// reoccuring: none / multiple / range => discriminated union
// Discriminated union for task recurrence types
const formSchema = z.discriminatedUnion("reoccuring", [
  single,
  multiple,
  range,
]);

export const AddTaskForm = ({ isModal }) => {
  const searchParams = useSearchParams();
  const presetDate = searchParams.get("date");
  const presetUserId = searchParams.get("userId");

  const { users } = useUsers();
  const { addTask, loading } = useTasks();
  const [submitted, setSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState(null);
  const router = useRouter();

// Initializing the form with default values and validation schema
  const form = useForm({
    resolver: zodResolver(formSchema), // Using zod for validation
    defaultValues: {
      title: "",
      ownerId: presetUserId ?? "", // Default owner ID is preset user ID or empty
      reoccuring: "none",
      date: presetDate
        ? parse(presetDate, "yyyy-MM-dd", new Date()) ?? new Date()
        : new Date(),
    },
  });

  const reoccuringType = form.watch("reoccuring"); // Watching the recurrence type field

  // Set the date field when the component mounts
  useEffect(() => {
    if (presetDate) {
      const date = parse(presetDate, "yyyy-MM-dd", new Date());
      form.setValue("date", date);
    }
  }, [presetDate, form]);

  // Function to generate a unique task ID
  const generateUniqueTaskId = async (ownerId) => {
    let uniqueId = crypto.randomUUID();
    let generatedTaskId = `${ownerId}-${uniqueId}`; // Create a unique task ID

    // Check if the ID exists in the database
    while (await checkIdExistsInDB(generatedTaskId)) {
      uniqueId = crypto.randomUUID(); // Regenerate if the ID exists
      generatedTaskId = `${ownerId}-${uniqueId}`; // Create a unique task ID
    }

    return generatedTaskId;
  };

  // Function to check if a uniqueTaskId already exists in Firestore
  const checkIdExistsInDB = async (uniqueTaskId) => {
    const q = query(
      collection(db, "tasks"), // Querying the tasks collection
      where("uniqueTaskId", "==", uniqueTaskId) // Checking for the unique task ID
    ); 
    const querySnapshot = await getDocs(q); // Getting documents matching the query

    return !querySnapshot.empty; // Returns true if ID exists, false otherwise
  };

  const onSubmit = async (values) => {
    const uniqueTaskId = await generateUniqueTaskId(values.ownerId); // Generate unique ID fir task

    const base = {
      title: values.title,
      ownerId: values.ownerId,
      uniqueTaskId,
    };
    try {
      setSubmitted(true);
// Handle different recurrence types
      if (values.reoccuring === "none") {
        await addTask({ ...base, date: values.date }, values.date);
      }
      if (values.reoccuring === "multiple") {
        const lastDate = values.dateMultiple[values.dateMultiple.length - 1]; // Get the last date
        await Promise.all(
          values.dateMultiple.map((d) =>
            addTask({ ...base, date: d }, lastDate)
          ) // Pass the last date as deadline
        );
      }
      if (values.reoccuring === "range") {
        const days = eachDayOfInterval({
          start: values.dateRange.from,
          end: values.dateRange.to,
        });
        const lastDate = days[days.length - 1]; // Get the last date in the range
        await Promise.all(
          days.map((d) => addTask({ ...base, date: d }, lastDate)) // Pass the last date as deadline
        );
      }
      form.reset();
       // Navigate based on whether the form is in a modal or not
      if (!isModal) {
        router.push("/");
      } else {
        router.back();
      }
    } catch (error) {
      console.error(error);
      setErrorMessage("Någonting gick fel, försök igen!");
      setSubmitted(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <FormField
          control={form.control}
          name="title"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Uppgift</FormLabel>
              <FormControl>
                <Input {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="ownerId"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tilldelad till</FormLabel>
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant="outline"
                      role="combobox"
                      className={cn(
                        "w-52 justify-between",
                        !field.value && "text-muted-foreground"
                      )}
                    >
                      {field.value
                        ? users.find((user) => user.uid === field.value)
                            ?.displayName
                        : "Välj användare"}
                      <ChevronsUpDown className="opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-52 p-0">
                  <Command>
                    <CommandInput
                      placeholder="Sök användare..."
                      className="h-9"
                    />
                    <CommandList>
                      <CommandEmpty>Inga användare hittades.</CommandEmpty>
                      <CommandGroup>
                        {users.map((user) => (
                          <CommandItem
                            value={user.displayName.toLowerCase()}
                            key={user.uid}
                            onSelect={() => {
                              form.setValue("ownerId", user.uid);
                            }}
                          >
                            {user.displayName}
                            <Check
                              className={cn(
                                "ml-auto",
                                user.uid === field.value
                                  ? "opacity-100"
                                  : "opacity-0"
                              )}
                            />
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </PopoverContent>
              </Popover>
              <FormDescription>
                This is the user that will be used in the dashboard.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="reoccuring"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Upprepning</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger className="w-full sm:w-52">
                    <SelectValue placeholder="Välj upprepning" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="none">Ingen</SelectItem>
                  <SelectItem value="multiple">Flera dagar</SelectItem>
                  <SelectItem value="range">Från - Till</SelectItem>
                </SelectContent>
              </Select>
              <FormDescription>
                {reoccuringType === "none" &&
                  'Välj hur ofta uppgiften ska upprepas. Väljer du "ingen" så är det engångsuppgift'}
                {reoccuringType === "multiple" &&
                  "Välj flera dagar som du vill ha uppiften på."}
                {reoccuringType === "range" &&
                  "Välj ett start- och slutdatum för uppgiften. Uppgiften kommer att upprepas varje dag mellan dessa datum."}
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        {reoccuringType === "none" && (
          <FormField
            control={form.control}
            name="date"
            render={({ field }) => (
              <FormItem>
                <Calendar
                  mode="single"
                  selected={field.value}
                  onSelect={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {reoccuringType === "multiple" && (
          <FormField
            control={form.control}
            name="dateMultiple"
            render={({ field }) => (
              <FormItem>
                <Calendar
                  mode="multiple"
                  selected={field.value}
                  onSelect={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}
        {reoccuringType === "range" && (
          <FormField
            control={form.control}
            name="dateRange"
            render={({ field }) => (
              <FormItem>
                <Calendar
                  mode="range"
                  selected={field.value}
                  onSelect={field.onChange}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}
        <Button disabled={loading || submitted} type="submit">
          {loading ? "Skapar..." : "Skapa uppgift"}
        </Button>
      </form>
    </Form>
  );
};
