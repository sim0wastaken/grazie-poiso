// import React from "react";
// import { useFieldArray, Control } from "react-hook-form";
// import { Button } from "@/components/ui/button";
// import {
//   FormField,
//   FormItem,
//   FormLabel,
//   FormControl,
//   FormMessage,
// } from "@/components/ui/form";
// import { Input } from "@/components/ui/input";
// import { Textarea } from "@/components/ui/textarea";

// // Define the prop types
// type InstructionFieldsProps = {
//   control: Control<any>; // Adjust type according to your form type
// };

// export const InstructionFields: React.FC<InstructionFieldsProps> = ({
//   control,
// }) => {
//   const { fields, append, remove } = useFieldArray({
//     name: "instructions",
//     control,
//   });

//   return (
//     <div className="space-y-4">
//       {fields.map((field, index) => (
//         <div key={field.id} className="space-y-4">
//           <FormField
//             control={control}
//             name={`instructions.${index}.title`}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Instruction Title {index + 1}</FormLabel>
//                 <FormControl>
//                   <Input
//                     placeholder={`Enter instruction title ${index + 1}`}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <FormField
//             control={control}
//             name={`instructions.${index}.description`}
//             render={({ field }) => (
//               <FormItem>
//                 <FormLabel>Instruction Description {index + 1}</FormLabel>
//                 <FormControl>
//                   <Textarea
//                     placeholder={`Enter instruction description ${index + 1}`}
//                     {...field}
//                   />
//                 </FormControl>
//                 <FormMessage />
//               </FormItem>
//             )}
//           />
//           <Button
//             type="button"
//             variant="destructive"
//             onClick={() => remove(index)}
//           >
//             Remove Instruction
//           </Button>
//         </div>
//       ))}
//       <Button type="button" variant="outline" onClick={() => append({ title: "", description: "" })}>
//         Add Instruction
//       </Button>
//     </div>
//   );
// };
