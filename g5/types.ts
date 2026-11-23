export interface FlipCard {
  id: string;
  type: 'تعريف' | 'تعليل' | 'مصطلح';
  front: string;       // السؤال أو المصطلح
  back: string;        // الجواب النموذجي المنهجي
  memoryHook: string;  // مفتاح حفظ سريع أو ربط ذهني
}

export interface ProcessStep {
  stepNumber: number;
  title: string;       // مثال: تفاعلات الضوء
  location: string;    // مثال: أغشية الثايلاكويد في البلاستيدة الخضراء
  inputs: string[];    // المدخلات (ماء، طاقة ضوئية...)
  outputs: string[];   // المخرجات (ATP, NADPH, O2)
  summary: string;     // شرح مختصر ومركّز
}

export interface ComparisonTable {
  id: string;
  title: string;
  colAHeader: string;
  colBHeader: string;
  rows: {
    criteria: string;  // وجه المقارنة
    colA: string;
    colB: string;
  }[];
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string; // التغذية الراجعة: لماذا الإجابة صحيحة؟
}

export interface ChapterData {
  id: number;
  title: string;
  sections: {
    id: string;
    title: string;
    coreSummary: string[];      // نقاط مركّزة (بدون حشو)
    enrichmentNote?: string;    // معلومة إثرائية قابلة للطي
    flipCards: FlipCard[];
    processSteps?: ProcessStep[];
    comparisons?: ComparisonTable[];
    quiz: QuizQuestion[];
  }[];
}
