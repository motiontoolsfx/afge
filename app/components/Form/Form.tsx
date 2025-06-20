"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { useState } from "react";
import { FormJson, Question } from "@/types/form";
import styles from "./form.module.css";

interface Props {
  formJson: FormJson;
}

export default function Form({ formJson }: Props) {
  const defaultValues = formJson.sections.reduce((acc, section) => {
    section.questions.forEach((q) => {
      acc[q.id] = q.type === "file" ? null : "";
    });
    return acc;
  }, {} as Record<string, any>);

  const {
    control,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors, isValid },
  } = useForm({
    defaultValues,
    mode: "onChange",
  });

  const [submitError, setSubmitError] = useState<string | null>(null);
  const [sectionIndex] = useState(0);
  const currentSection = formJson.sections[sectionIndex];

  const getOptionIdSafe = (q: Question, label: string) => {
    if (!q.options) return undefined;
    const found = q.options.find(
      (opt) => (typeof opt === "string" ? opt === label : opt.option === label)
    );
    return typeof found === "string" ? found : found?.id;
  };

  const getOptionId = (q: Question, label: string) => {
    if (!q.options) return label;
    const found = q.options.find(
      (opt) => (typeof opt === "string" ? opt === label : opt.option === label)
    );
    return typeof found === "string" ? found : found?.id ?? label;
  };

  const onSubmit = async (data: Record<string, any>) => {
    const formData = new FormData();

    // compute visible questions including branching
    const visibleQuestions: Question[] = [];
    currentSection.questions.forEach((q) => {
      visibleQuestions.push(q);

      if (q.branching) {
        const selectedId = getOptionIdSafe(q, data[q.id] || "");
        const branchSectionId = q.branching[selectedId as string];
        const branchSection = formJson.sections.find(s => s.id === branchSectionId);
        branchSection?.questions.forEach(subQ => visibleQuestions.push(subQ));
      }
    });

    visibleQuestions.forEach((q) => {
      const value = data[q.id];
      if (q.type === "dropdown" && q.options) {
        formData.append(q.id, getOptionId(q, value));
      } else if (q.type === "file") {
        if (value) formData.append(q.id, value);
      } else {
        formData.append(q.id, value);
      }
    });

    try {
      const resp = await fetch("/api/form/submit", {
        method: "POST",
        body: formData,
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

  const renderQuestion = (q: Question) => (
    <div key={q.id} className={styles.question}>
      <label>{q.title}</label>
      <Controller
        name={q.id}
        control={control}
        rules={{
          required: q.required,
          validate: (file: File | null) =>
            q.type === "file" && file && q.maxFileSize
              ? file.size <= q.maxFileSize * 1024 * 1024 || `File must be ≤ ${q.maxFileSize}MB`
              : true,
        }}
        render={({ field }) => {
          if (q.type === "file") {
            return (
              <>
                <input
                  type="file"
                  onChange={(e) => {
                    const file = e.target.files?.[0] || null;
                    if (file && q.maxFileSize && file.size > q.maxFileSize * 1024 * 1024) {
                      setError(q.id, {
                        type: "manual",
                        message: `File must be ≤ ${q.maxFileSize}MB`,
                      });
                      e.target.value = "";
                      field.onChange(null);
                      return;
                    }
                    clearErrors(q.id);
                    field.onChange(file);
                  }}
                />
                {q.maxFileSize && (
                  <small className={styles.helperText}>
                    Max file size: {q.maxFileSize}MB
                  </small>
                )}
                {errors[q.id] && (
                  <p className={styles.requiredText}>
                    {(errors[q.id] as any)?.message ?? `${q.title} is required.`}
                  </p>
                )}
              </>
            );
          }

          if (q.type === "dropdown") {
            return (
              <>
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
                {errors[q.id] && (
                  <p className={styles.requiredText}>{q.title} is required.</p>
                )}
              </>
            );
          }

          return (
            <>
              <input type="text" {...field} value={field.value ?? ""} />
              {errors[q.id] && (
                <p className={styles.requiredText}>{q.title} is required.</p>
              )}
            </>
          );
        }}
      />
    </div>
  );

  const renderQuestionWithBranching = (q: Question) => {
    const value = useWatch({ control, name: q.id });
    const branchSectionId = q.branching?.[getOptionIdSafe(q, value) as string];
    const branchSection = formJson.sections.find(s => s.id === branchSectionId);

    return (
      <div key={q.id}>
        {renderQuestion(q)}
        {branchSection?.questions.map(subQ => (
          <div key={subQ.id} style={{ marginLeft: 20 }}>
            {renderQuestion(subQ)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className={styles.form}>
      <div className={styles.formHeading}>
        <h1>{formJson.title}</h1>
        <p>{formJson.subtitle}</p>
      </div>

      <div className={styles.formContent}>
        <h2 className={styles.sectionHeading}>{currentSection.title}</h2>

        {currentSection.questions
          .filter(
            (q) =>
              !currentSection.questions.some(parentQ =>
                parentQ.branching && Object.values(parentQ.branching).includes(q.id)
              ) || q.branching !== undefined
          )
          .map(renderQuestionWithBranching)}

        {submitError && (
          <div className={styles.requiredText}>
            <strong>Error:</strong> {submitError}
          </div>
        )}

        <div style={{ marginTop: "1rem" }}>
          <button className="button-solid" type="submit" disabled={!isValid}>
            Submit
          </button>
        </div>
      </div>
    </form>
  );
}
