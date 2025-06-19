"use client";

import { useForm, Controller } from "react-hook-form";
import { useState } from "react";
import { FormJson, Question } from "@/types/form";

import styles from './form.module.css';

interface Props {
  formJson: FormJson;
}

export default function Form({ formJson }: Props) {
  // initialize defaultValues, including files as null
  const defaultValues = formJson.sections.reduce((acc, section) => {
    section.questions.forEach((q) => {
      acc[q.id] = q.type === "file" ? null : "";
    });
    return acc;
  }, {} as Record<string, any>);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors }
  } = useForm({ defaultValues });

  const [sectionIndex, setSectionIndex] = useState(0);
  const [history, setHistory] = useState<number[]>([]);
  const [submitError, setSubmitError] = useState<string | null>(null);
  const currentSection = formJson.sections[sectionIndex];

  // map dropdown label back to option id
  const getOptionId = (q: Question, label: string) => {
    if (!q.options) return label;
    const found = q.options.find(
      (opt) => (typeof opt === "string" ? opt === label : opt.option === label)
    );
    if (!found) return label;
    return typeof found === "string" ? found : found.id;
  };

  const onSubmit = async (data: Record<string, any>) => {
    const formData = new FormData();

    currentSection.questions.forEach((q) => {
      const value = data[q.id];
      if (q.type === "dropdown" && q.options) {
        formData.append(q.id, getOptionId(q, value));
      } else if (q.type === "file") {
        if (value) formData.append(q.id, value);
      } else {
        formData.append(q.id, value);
      }
    });

    // handle branching
    const branchingQ = currentSection.questions.find((q) => q.branching);
    const nextSectionId = branchingQ?.branching?.[data[branchingQ.id]];
    if (nextSectionId) {
      const nextIndex = formJson.sections.findIndex((s) => s.id === nextSectionId);
      if (nextIndex !== -1) {
        setHistory((h) => [...h, sectionIndex]);
        setSectionIndex(nextIndex);
        return;
      }
    }

    // final submit
    try {
      const resp = await fetch("/api/form/submit", {
        method: "POST",
        body: formData, // multipart/form-data
      });

      if (!resp.ok) {
        const err = await resp.json();
        setSubmitError(err.error || "An error occurred while submitting.");
      } else {
        alert("Form submitted successfully!");
      }
    } catch {
      setSubmitError("An error occurred while submitting.");
    }
  };

  const goBack = () => {
    if (!history.length) return;
    const prev = [...history];
    const last = prev.pop()!;
    setHistory(prev);
    setSectionIndex(last);
  };

  const renderQuestion = (q: Question) => (
    <div key={q.id} className={styles.question}>
      <label>{q.title}</label>
      <Controller
        name={q.id}
        control={control}
        rules={{ required: q.required }}
        render={({ field }) => {
          if (q.type === "file") {
            return (
              <>
                <input
                  type="file"
                  onChange={(e) => field.onChange(e.target.files?.[0] || null)}
                />
                {errors[q.id] && (
                  <p className={styles.requiredText}>
                    {q.title} is required.
                  </p>
                )}
              </>
            );
          }

          if (q.type === "dropdown") {
            return (
              <>
                <div className="select">
                  <select {...field} value={field.value ?? ""}>
                    <option value="">Select...</option>
                    {q.options?.map((opt) =>
                      typeof opt === "string" ? (
                        <option key={opt} value={opt}>
                          {opt}
                        </option>
                      ) : (
                        <option key={opt.id} value={opt.option}>
                          {opt.option}
                        </option>
                      )
                    )}
                  </select>
                </div>
                {errors[q.id] && (
                  <p className={styles.requiredText}>
                    {q.title} is required.
                  </p>
                )}
              </>
            );
          }

          // default to text input
          return (
            <>
              <input type="text" {...field} value={field.value ?? ""} />
              {errors[q.id] && (
                <p className={styles.requiredText}>
                  {q.title} is required.
                </p>
              )}
            </>
          );
        }}
      />
    </div>
  );

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formHeading}>
        <h1>{formJson.title}</h1>
        <p>{formJson.subtitle}</p>
      </div>

      <div className={styles.formContent}>
        <h2 className={styles.sectionHeading}>{currentSection.title}</h2>
        {currentSection.questions.map(renderQuestion)}

        {submitError && (
          <div className={styles.requiredText}>
            <strong>Error:</strong> {submitError}
          </div>
        )}

        <div style={{ display: "flex", gap: "1rem" }}>
          {history.length > 0 && (
            <button type="button" onClick={goBack}>
              Back
            </button>
          )}
          {(() => {
            const branchingQ = currentSection.questions.find((q) => q.branching);
            const nextSectionId = branchingQ?.branching?.[watch(branchingQ?.id)];
            const isLast = !nextSectionId;
            return (
              <button
                className="button-outline"
                type="submit"
                disabled={Object.keys(errors).length > 0}
              >
                {isLast ? "Submit" : "Next"}
              </button>
            );
          })()}
        </div>
      </div>
    </form>
  );
}
