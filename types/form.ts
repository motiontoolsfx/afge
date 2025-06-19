export type QuestionOption = {
    id: string;
    option: string;
};

export type QuestionType = "short_answer" | "dropdown" | "file";

export interface Question {
    id: string;
    title: string;
    type: QuestionType;
    required: boolean;
    options?: Array<string | { id: string; option: string }>;
    branching?: Record<string, string>;
}

export type Section = {
    id: string;
    title: string;
    questions: Question[];
};

export type FormJson = {
    title: string;
    subtitle: string;
    sections: Section[];
};
