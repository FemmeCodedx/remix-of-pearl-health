// Phase-aware mental wellness reads. Original short content, no copyrighted excerpts.

export type Phase = "menstruation" | "follicular" | "ovulation" | "luteal" | "general";

export type MHArticle = {
  slug: string;
  phase: Phase;
  readTime: string;
  en: { title: string; summary: string; body: string };
  es: { title: string; summary: string; body: string };
};

export const mentalHealthArticles: MHArticle[] = [
  // ---------------- MENSTRUATION ----------------
  {
    slug: "menstruation-rest-is-productive",
    phase: "menstruation",
    readTime: "2 min",
    en: {
      title: "Rest is productive",
      summary: "Lower energy during your period is biology, not laziness.",
      body: "Estrogen and progesterone are at their lowest, which can blunt motivation and focus. Treat rest as a task on your list: shorter to-dos, gentler workouts, earlier bedtimes. A 20-minute walk or a quiet evening protects your week far more than pushing through. Notice what you ask of yourself today — would you ask the same of a friend who felt this way?",
    },
    es: {
      title: "Descansar es productivo",
      summary: "La baja energía durante la menstruación es biología, no pereza.",
      body: "El estrógeno y la progesterona están en su nivel más bajo, lo que reduce la motivación y la concentración. Trata el descanso como una tarea: listas más cortas, entrenamientos suaves, dormir antes. Una caminata de 20 minutos o una noche tranquila protegen tu semana más que forzarte. Observa qué te exiges hoy: ¿se lo pedirías a una amiga que se sintiera igual?",
    },
  },
  {
    slug: "menstruation-introspection",
    phase: "menstruation",
    readTime: "2 min",
    en: {
      title: "A natural time to reflect",
      summary: "The intuitive, inward pull of menstruation is a feature.",
      body: "Many people feel more sensitive and reflective during their period. Lean into it: journal one paragraph about what worked last cycle and what drained you. These notes are gold when you plan the next month. If sadness feels persistent rather than passing, write it down too — patterns are easier to act on than vague feelings.",
    },
    es: {
      title: "Un momento natural para reflexionar",
      summary: "La introspección de la menstruación es una característica, no un fallo.",
      body: "Muchas personas se sienten más sensibles y reflexivas durante la regla. Aprovéchalo: escribe un párrafo sobre qué funcionó el ciclo pasado y qué te agotó. Esas notas son oro al planear el próximo mes. Si la tristeza es persistente y no pasajera, anótalo también: los patrones son más fáciles de abordar que las sensaciones vagas.",
    },
  },
  {
    slug: "menstruation-pain-and-mood",
    phase: "menstruation",
    readTime: "2 min",
    en: {
      title: "Pain quietly shapes mood",
      summary: "Cramps drain emotional bandwidth — treat them seriously.",
      body: "Untreated period pain raises stress hormones and shortens your fuse. Heat, hydration, magnesium, and anti-inflammatories (when appropriate) aren't weakness — they free up energy for the people and work that matter. If pain regularly stops you from functioning, that is medical information worth bringing to a clinician.",
    },
    es: {
      title: "El dolor moldea el ánimo en silencio",
      summary: "Los cólicos consumen ancho de banda emocional — tómalos en serio.",
      body: "El dolor menstrual no tratado eleva las hormonas del estrés y acorta la paciencia. Calor, hidratación, magnesio y antiinflamatorios (cuando sean adecuados) no son debilidad: liberan energía para lo que importa. Si el dolor te impide funcionar con frecuencia, es información médica que merece consulta.",
    },
  },

  // ---------------- FOLLICULAR ----------------
  {
    slug: "follicular-fresh-start",
    phase: "follicular",
    readTime: "2 min",
    en: {
      title: "Your monthly fresh start",
      summary: "Rising estrogen lifts mood, curiosity, and risk tolerance.",
      body: "The week after your period is the brain's natural sandbox. Use it: start that course, send the email, pitch the idea, plan the trip. Decisions made now tend to feel braver and stick better. Capture three small experiments to run this phase — you'll have the bandwidth to follow through.",
    },
    es: {
      title: "Tu reinicio mensual",
      summary: "El estrógeno en ascenso mejora ánimo, curiosidad y tolerancia al riesgo.",
      body: "La semana después de la regla es el laboratorio natural del cerebro. Aprovéchala: empieza ese curso, envía el correo, propón la idea, planea el viaje. Las decisiones que tomas ahora suelen sentirse más valientes y sostenerse mejor. Anota tres pequeños experimentos para esta fase: tendrás la energía para llevarlos a cabo.",
    },
  },
  {
    slug: "follicular-social-energy",
    phase: "follicular",
    readTime: "2 min",
    en: {
      title: "Lean into connection",
      summary: "Social bandwidth peaks — use it intentionally.",
      body: "You'll likely feel more open and verbal. Schedule the harder conversations now: feedback at work, a check-in with a friend you've been avoiding, a difficult family call. The same conversation costs less emotionally this week than it will in your luteal phase.",
    },
    es: {
      title: "Apóyate en la conexión",
      summary: "El ancho de banda social aumenta — úsalo a propósito.",
      body: "Probablemente te sientas más abierta y comunicativa. Agenda ahora las conversaciones difíciles: feedback en el trabajo, una charla con una amiga que has evitado, una llamada familiar complicada. La misma conversación cuesta menos esta semana que en la fase lútea.",
    },
  },
  {
    slug: "follicular-build-habits",
    phase: "follicular",
    readTime: "2 min",
    en: {
      title: "A good week to build habits",
      summary: "Habit formation is easier when motivation runs high.",
      body: "Start the new routine here, not in the luteal slump. Pair the new habit with something you already do (after morning coffee → 5 min stretch). Make the bar embarrassingly low for the first two weeks. Future-you in the luteal phase will thank you.",
    },
    es: {
      title: "Buena semana para crear hábitos",
      summary: "Es más fácil formar hábitos cuando la motivación está alta.",
      body: "Empieza la rutina nueva aquí, no en el bajón lúteo. Asocia el hábito a algo que ya haces (después del café → 5 min de estiramiento). Pon el listón vergonzosamente bajo las dos primeras semanas. Tu yo de la fase lútea te lo agradecerá.",
    },
  },

  // ---------------- OVULATION ----------------
  {
    slug: "ovulation-visible-confident",
    phase: "ovulation",
    readTime: "2 min",
    en: {
      title: "Use your most visible week",
      summary: "Confidence and communication peak around ovulation.",
      body: "Estrogen and testosterone are high together. Words flow more easily, eye contact feels natural, and risk feels surmountable. Book presentations, networking, dates, and asks for this window. If something has been sitting in your drafts, send it now.",
    },
    es: {
      title: "Aprovecha tu semana más visible",
      summary: "La confianza y la comunicación alcanzan su punto máximo en la ovulación.",
      body: "Estrógeno y testosterona están altos a la vez. Las palabras fluyen, el contacto visual se siente natural y los riesgos se ven manejables. Agenda presentaciones, networking, citas y peticiones importantes para esta ventana. Si algo lleva tiempo en tus borradores, envíalo ahora.",
    },
  },
  {
    slug: "ovulation-watch-overcommit",
    phase: "ovulation",
    readTime: "2 min",
    en: {
      title: "Don't overpromise",
      summary: "Confident-you commits the calendar future-you has to live with.",
      body: "Yes feels easy this week. Before agreeing to anything new, picture your luteal-week energy honoring it. A quick rule: any commitment more than two weeks out gets a 24-hour pause. Your future self gets a vote.",
    },
    es: {
      title: "No prometas de más",
      summary: "La yo confiada compromete la agenda que la yo futura tendrá que cumplir.",
      body: "Decir sí es fácil esta semana. Antes de aceptar algo nuevo, imagina a tu yo de la fase lútea cumpliéndolo. Una regla simple: cualquier compromiso a más de dos semanas vista espera 24 horas. Tu yo futura también vota.",
    },
  },
  {
    slug: "ovulation-process-feedback",
    phase: "ovulation",
    readTime: "2 min",
    en: {
      title: "A good time for hard feedback",
      summary: "You're more resilient to criticism this week.",
      body: "Ask for the review, listen to the note, read the email you've been postponing. The same input that would sting in the luteal phase often lands as useful here. Capture one concrete action from any feedback you receive.",
    },
    es: {
      title: "Buen momento para recibir críticas",
      summary: "Eres más resiliente a la crítica esta semana.",
      body: "Pide la evaluación, escucha el comentario, lee ese correo que has pospuesto. La misma información que en la fase lútea dolería suele aterrizar como útil aquí. Saca una acción concreta de cada feedback que recibas.",
    },
  },

  // ---------------- LUTEAL ----------------
  {
    slug: "luteal-pms-isnt-personality",
    phase: "luteal",
    readTime: "2 min",
    en: {
      title: "PMS is not your personality",
      summary: "Hormonal shifts amplify whatever's already there.",
      body: "Falling estrogen and rising-then-falling progesterone can sharpen irritability, anxiety, and self-criticism. The thoughts feel true; many of them are just amplified. A simple test: 'Would I believe this thought as strongly in week two?' If no, write it down and revisit it then.",
    },
    es: {
      title: "El síndrome premenstrual no es tu personalidad",
      summary: "Los cambios hormonales amplifican lo que ya está ahí.",
      body: "La caída del estrógeno y el sube-y-baja de la progesterona pueden agudizar la irritabilidad, la ansiedad y la autocrítica. Los pensamientos se sienten ciertos; muchos solo están amplificados. Una prueba simple: '¿Creería esto con la misma fuerza en la semana dos?' Si no, anótalo y revísalo entonces.",
    },
  },
  {
    slug: "luteal-shrink-the-week",
    phase: "luteal",
    readTime: "2 min",
    en: {
      title: "Shrink the week",
      summary: "Plan less, finish more.",
      body: "Energy is best spent on closing loops, not opening them. Pick the three things that must be done this week and let the rest wait. Block one quiet evening. Eat earlier. Move your body gently. The goal isn't to do more — it's to land softly.",
    },
    es: {
      title: "Achica la semana",
      summary: "Planea menos, termina más.",
      body: "La energía se invierte mejor en cerrar ciclos que en abrirlos. Elige las tres cosas que deben hacerse esta semana y deja el resto en espera. Bloquea una noche tranquila. Cena antes. Mueve el cuerpo con suavidad. La meta no es hacer más: es aterrizar suave.",
    },
  },
  {
    slug: "luteal-watch-for-pmdd",
    phase: "luteal",
    readTime: "3 min",
    en: {
      title: "When PMS feels like more",
      summary: "Severe, predictable mood symptoms deserve a clinician.",
      body: "PMDD (premenstrual dysphoric disorder) affects up to 1 in 20 menstruating people: intense low mood, hopelessness, rage, or anxiety in the week or two before bleeding, lifting within a few days after. If symptoms repeat across cycles and disrupt work or relationships, that's worth a conversation with a doctor. Track it for two cycles — the data alone shortens diagnosis time.",
    },
    es: {
      title: "Cuando el SPM se siente como más",
      summary: "Síntomas anímicos severos y predecibles merecen atención médica.",
      body: "El TDPM (trastorno disfórico premenstrual) afecta hasta a 1 de cada 20 personas que menstrúan: tristeza intensa, desesperanza, ira o ansiedad en la semana o dos antes del sangrado, que se alivian a los pocos días de iniciar. Si los síntomas se repiten ciclo a ciclo y afectan trabajo o relaciones, vale la pena hablar con un médico. Regístralo durante dos ciclos: los datos por sí solos acortan el diagnóstico.",
    },
  },

  // ---------------- GENERAL ----------------
  {
    slug: "general-boundaries-as-care",
    phase: "general",
    readTime: "2 min",
    en: {
      title: "Boundaries are care, not conflict",
      summary: "A small 'no' protects a meaningful 'yes'.",
      body: "Boundaries are simply where your responsibility ends. They sound like: 'I can't this week, but I can next Tuesday,' or 'I'd rather not discuss this right now.' You don't owe an essay — a clear, kind sentence is enough. Practice one this week and notice how the people who matter respond.",
    },
    es: {
      title: "Los límites son cuidado, no conflicto",
      summary: "Un 'no' pequeño protege un 'sí' importante.",
      body: "Los límites son simplemente dónde termina tu responsabilidad. Suenan así: 'Esta semana no puedo, el próximo martes sí', o 'Prefiero no hablar de esto ahora'. No debes un ensayo: una frase clara y amable basta. Practica uno esta semana y observa cómo responden las personas que importan.",
    },
  },
  {
    slug: "general-when-to-seek-help",
    phase: "general",
    readTime: "2 min",
    en: {
      title: "When to reach out for support",
      summary: "Therapy isn't only for crisis.",
      body: "Talk to a professional if low mood, anxiety, or hopelessness lasts most days for two weeks; if sleep, appetite, or functioning shift noticeably; or if you're using alcohol, food, or scrolling to numb out. If you're having thoughts of harming yourself, contact local emergency services or a crisis line in your country immediately. Reaching out early shortens the road.",
    },
    es: {
      title: "Cuándo pedir apoyo",
      summary: "La terapia no es solo para la crisis.",
      body: "Habla con un profesional si el ánimo bajo, la ansiedad o la desesperanza duran la mayor parte de los días durante dos semanas; si tu sueño, apetito o funcionamiento cambian notablemente; o si usas alcohol, comida o pantallas para anestesiarte. Si tienes pensamientos de hacerte daño, contacta de inmediato a los servicios de emergencia o a una línea de crisis de tu país. Pedir ayuda pronto acorta el camino.",
    },
  },
];
