// Curated articles inspired by foundational women's health books.
// Content is original paraphrasing — no copyrighted excerpts.

export type ArticleCategory =
  | "Education"
  | "Wellness"
  | "Nutrition"
  | "Equity"
  | "Lifestyle";

export type LocalizedArticle = {
  title: string;
  summary: string;
  body: string[];
  takeaways: string[];
};

export type Article = {
  slug: string;
  emoji: string;
  category: ArticleCategory;
  readTime: string; // e.g., "5 min"
  source: { book: string; author: string };
  en: LocalizedArticle;
  es: LocalizedArticle;
};

export const articles: Article[] = [
  // ---------------- Doing Harm — Maya Dusenbery ----------------
  {
    slug: "knowledge-gap-women-medicine",
    emoji: "🔬",
    category: "Equity",
    readTime: "6 min",
    source: { book: "Doing Harm", author: "Maya Dusenbery" },
    en: {
      title: "The Knowledge Gap: Why Medicine Knows Less About Women",
      summary:
        "For decades, the 'default patient' in medical research was a 70 kg white man. The result is a knowledge gap that still shapes how women are diagnosed and treated today.",
      body: [
        "Until the early 1990s, women of childbearing age were largely excluded from clinical drug trials. Researchers assumed findings from men's bodies could simply be extrapolated to women — an assumption we now know is wrong.",
        "Sex differences appear everywhere: in how drugs are metabolized, in heart attack symptoms, in autoimmune risk, even in pain perception. Yet many studies still don't analyze and report results by sex, meaning the gap keeps reproducing itself.",
        "Diseases that mostly affect women — autoimmune conditions, chronic pain syndromes, migraine, fibromyalgia — receive a fraction of the research funding their burden warrants. The average autoimmune diagnosis still takes about four years and four doctors.",
        "Knowing this isn't about distrusting medicine. It's about being an informed advocate: ask whether a treatment was studied in women, track your own data, and seek a second opinion when something feels off.",
      ],
      takeaways: [
        "Women were excluded from most clinical trials until the 1990s.",
        "Sex differences exist in drug response, symptoms, and disease risk.",
        "Female-dominant diseases are systematically under-funded.",
        "Tracking your own symptoms is one of the strongest tools you have.",
      ],
    },
    es: {
      title: "La brecha de conocimiento: por qué la medicina sabe menos sobre las mujeres",
      summary:
        "Durante décadas, el 'paciente por defecto' en la investigación médica fue un hombre blanco de 70 kg. El resultado es una brecha de conocimiento que aún hoy condiciona cómo se diagnostica y trata a las mujeres.",
      body: [
        "Hasta principios de los noventa, las mujeres en edad fértil quedaban excluidas de la mayoría de ensayos clínicos. Se asumía que los resultados obtenidos en cuerpos masculinos podían extrapolarse — una suposición que hoy sabemos errónea.",
        "Las diferencias por sexo aparecen en todas partes: en cómo se metabolizan los fármacos, en los síntomas del infarto, en el riesgo autoinmune, incluso en la percepción del dolor. Aun así, muchos estudios siguen sin desglosar resultados por sexo.",
        "Las enfermedades que afectan sobre todo a mujeres — autoinmunes, dolor crónico, migraña, fibromialgia — reciben una fracción del financiamiento que su impacto justificaría. El diagnóstico autoinmune promedio aún tarda cerca de cuatro años y cuatro médicos.",
        "Saber esto no es desconfiar de la medicina. Es convertirte en una paciente informada: pregunta si un tratamiento se estudió en mujeres, registra tus propios datos y busca una segunda opinión cuando algo no encaje.",
      ],
      takeaways: [
        "Las mujeres fueron excluidas de la mayoría de ensayos clínicos hasta los años noventa.",
        "Hay diferencias por sexo en respuesta a fármacos, síntomas y riesgo de enfermedad.",
        "Las enfermedades con mayoría femenina están sistemáticamente subfinanciadas.",
        "Registrar tus propios síntomas es una de tus herramientas más poderosas.",
      ],
    },
  },
  {
    slug: "trust-gap-medical-gaslighting",
    emoji: "🗣️",
    category: "Equity",
    readTime: "5 min",
    source: { book: "Doing Harm", author: "Maya Dusenbery" },
    en: {
      title: "The Trust Gap: When Your Pain Isn't Believed",
      summary:
        "Women — and especially women of color — are more likely to have their symptoms dismissed as anxiety, stress, or 'all in your head.' Naming this pattern is the first step to pushing back.",
      body: [
        "Studies show women wait longer in emergency rooms for pain medication, are more often offered sedatives instead of analgesics, and are more likely to be told their physical symptoms are psychological.",
        "This 'trust gap' compounds the knowledge gap: if doctors don't know what to look for, and don't believe what you describe, conditions go undiagnosed for years.",
        "Practical tools that help: bring a written symptom log with dates and severity, ask 'what else could this be?', request that 'patient declined further workup' is removed from your chart if untrue, and ask for the suspected diagnosis in writing.",
        "If you feel dismissed, you are allowed to leave and seek another opinion. Your perception of your own body is data.",
      ],
      takeaways: [
        "Women are more likely to be told pain is psychological.",
        "Bring written, dated symptom logs to appointments.",
        "Ask 'what else could this be?' to widen the differential.",
        "Seeking a second opinion is a normal, healthy step.",
      ],
    },
    es: {
      title: "La brecha de confianza: cuando no te creen el dolor",
      summary:
        "Las mujeres — y muy especialmente las mujeres racializadas — tienen más probabilidad de que sus síntomas se descarten como ansiedad, estrés o 'cosas de la cabeza'. Nombrar el patrón es el primer paso para enfrentarlo.",
      body: [
        "Los estudios muestran que las mujeres esperan más en urgencias para recibir analgésicos, reciben con más frecuencia sedantes en lugar de calmantes y escuchan más a menudo que sus síntomas físicos son psicológicos.",
        "Esta 'brecha de confianza' se suma a la de conocimiento: si los médicos no saben qué buscar y no creen lo que describes, las enfermedades quedan sin diagnosticar durante años.",
        "Herramientas que ayudan: lleva un registro escrito de síntomas con fechas e intensidad, pregunta '¿qué más podría ser esto?', pide que se elimine de tu historia clínica un 'la paciente rechazó más estudios' si no es cierto y solicita por escrito el diagnóstico sospechado.",
        "Si te sientes desestimada, puedes irte y buscar otra opinión. Tu percepción de tu propio cuerpo es información válida.",
      ],
      takeaways: [
        "Es más probable que a las mujeres se les diga que el dolor es psicológico.",
        "Lleva un registro escrito y fechado de síntomas a las citas.",
        "Pregunta '¿qué más podría ser?' para ampliar el diagnóstico.",
        "Buscar una segunda opinión es un paso normal y saludable.",
      ],
    },
  },
  {
    slug: "heart-disease-female-symptoms",
    emoji: "❤️",
    category: "Education",
    readTime: "4 min",
    source: { book: "Doing Harm", author: "Maya Dusenbery" },
    en: {
      title: "Heart Attacks Don't Always Look Like the Movies",
      summary:
        "Heart disease is the #1 killer of women, yet many are sent home from the ER because their symptoms didn't match the 'classic' male presentation.",
      body: [
        "The textbook heart attack — crushing chest pain radiating down the left arm — was defined in male patients. Women often present with shortness of breath, nausea, jaw or back pain, unusual fatigue, or a sense of impending doom.",
        "Younger women under 55 are especially likely to be misdiagnosed. They are seven times more likely than men of the same age to be sent home mid-heart-attack.",
        "Know your numbers: blood pressure, cholesterol, fasting glucose, and family history. If something feels wrong — particularly with sudden fatigue, breathlessness, or jaw pain — say the words 'I am worried about my heart.' That phrase changes the workup.",
      ],
      takeaways: [
        "Heart disease is the leading cause of death in women.",
        "Female symptoms include nausea, fatigue, jaw or back pain.",
        "Younger women are most often misdiagnosed.",
        "Saying 'I'm worried about my heart' triggers a fuller workup.",
      ],
    },
    es: {
      title: "Los infartos no siempre son como en las películas",
      summary:
        "Las enfermedades cardíacas son la primera causa de muerte en mujeres, pero a muchas las envían a casa desde urgencias porque sus síntomas no coinciden con la presentación 'clásica' masculina.",
      body: [
        "El infarto de manual — dolor opresivo en el pecho que irradia al brazo izquierdo — se definió en pacientes hombres. Las mujeres suelen presentar falta de aire, náuseas, dolor de mandíbula o espalda, fatiga inusual o una sensación de peligro inminente.",
        "Las mujeres menores de 55 años corren especial riesgo de ser mal diagnosticadas: tienen siete veces más probabilidad que los hombres de su edad de ser enviadas a casa en pleno infarto.",
        "Conoce tus cifras: presión arterial, colesterol, glucosa en ayunas e historia familiar. Si algo va mal — sobre todo fatiga súbita, falta de aire o dolor de mandíbula — di textualmente 'me preocupa mi corazón'. Esa frase cambia el estudio que te harán.",
      ],
      takeaways: [
        "La enfermedad cardíaca es la primera causa de muerte en mujeres.",
        "Síntomas femeninos: náuseas, fatiga, dolor de mandíbula o espalda.",
        "Las mujeres jóvenes son las más mal diagnosticadas.",
        "Decir 'me preocupa mi corazón' activa un estudio más completo.",
      ],
    },
  },

  // ---------------- Women's Bodies, Women's Wisdom — Christiane Northrup ----------------
  {
    slug: "cycle-as-inner-guidance",
    emoji: "🌙",
    category: "Wellness",
    readTime: "5 min",
    source: { book: "Women's Bodies, Women's Wisdom", author: "Christiane Northrup, M.D." },
    en: {
      title: "Your Cycle as Inner Guidance",
      summary:
        "Your menstrual cycle isn't a problem to manage — it's a monthly check-in with your body, your mind, and your nervous system.",
      body: [
        "Northrup frames the cycle as a built-in feedback loop. Symptoms that surface in the days before your period — sensitivity, anger, sadness, clarity — are often pointing at something in your life that needs attention, not a malfunction to suppress.",
        "Mid-cycle and follicular energy tends toward outward action and connection. Luteal and menstrual energy invites slowing down, reflection, and discernment. A culture that runs on a 24-hour productivity loop rarely makes room for the second half.",
        "A simple practice: at the end of each phase, write one sentence on what your body asked for and one on what felt good. Patterns appear within two or three cycles.",
      ],
      takeaways: [
        "Premenstrual sensitivity often surfaces real, true information.",
        "Energy and focus shift naturally across phases.",
        "Plan demanding work for follicular/ovulatory days when possible.",
        "A one-line journal per phase reveals patterns quickly.",
      ],
    },
    es: {
      title: "Tu ciclo como guía interior",
      summary:
        "Tu ciclo menstrual no es un problema que controlar: es una conversación mensual con tu cuerpo, tu mente y tu sistema nervioso.",
      body: [
        "Northrup describe el ciclo como un sistema de retroalimentación. Los síntomas que aparecen en los días previos a la menstruación — sensibilidad, enojo, tristeza, lucidez — suelen señalar algo de tu vida que pide atención, no un fallo que reprimir.",
        "La energía folicular y ovulatoria se inclina a la acción y la conexión. La lútea y menstrual invita a bajar el ritmo, reflexionar y discernir. Una cultura productivista 24/7 rara vez hace espacio para esa segunda mitad.",
        "Práctica simple: al final de cada fase, escribe una frase sobre lo que pidió tu cuerpo y otra sobre lo que se sintió bien. Los patrones aparecen en dos o tres ciclos.",
      ],
      takeaways: [
        "La sensibilidad premenstrual suele revelar información verdadera.",
        "La energía y el foco cambian naturalmente entre fases.",
        "Planifica el trabajo exigente en días foliculares/ovulatorios cuando puedas.",
        "Una frase por fase en tu diario revela patrones rápido.",
      ],
    },
  },
  {
    slug: "bodymind-beliefs-are-physical",
    emoji: "🧠",
    category: "Wellness",
    readTime: "4 min",
    source: { book: "Women's Bodies, Women's Wisdom", author: "Christiane Northrup, M.D." },
    en: {
      title: "The Bodymind: Beliefs That Become Physical",
      summary:
        "Chronic stress, suppressed emotion, and inherited beliefs don't stay 'in the head.' They show up in cortisol, immunity, digestion, and pelvic health.",
      body: [
        "Northrup's central thesis is that the body and mind are one continuous system. Persistent feelings — especially the ones we were taught not to express — register physically through the autonomic nervous system, hormones, and inflammation.",
        "This isn't blame. You did not 'cause' your endometriosis or your migraines. But the nervous system is one of the few levers you can move directly: breathwork, somatic practices, sleep, and safe relationships measurably shift hormonal and immune patterns.",
        "If a symptom keeps returning despite a clean medical workup, ask: what is this part of my body trying to protect or express? Curiosity is more useful than judgment.",
      ],
      takeaways: [
        "Chronic stress alters hormones and immunity, not just mood.",
        "Breath, sleep, and safe connection shift the nervous system.",
        "Symptoms can carry information worth listening to.",
        "Curiosity beats self-blame, every time.",
      ],
    },
    es: {
      title: "El cuerpo-mente: creencias que se vuelven físicas",
      summary:
        "El estrés crónico, las emociones reprimidas y las creencias heredadas no se quedan 'en la cabeza'. Aparecen en el cortisol, la inmunidad, la digestión y la salud pélvica.",
      body: [
        "La tesis central de Northrup es que cuerpo y mente son un mismo sistema continuo. Las emociones persistentes — sobre todo las que nos enseñaron a no expresar — se registran físicamente vía sistema nervioso autónomo, hormonas e inflamación.",
        "Esto no es culpabilizar. No 'causaste' tu endometriosis ni tus migrañas. Pero el sistema nervioso es una de las pocas palancas que puedes mover directamente: respiración, prácticas somáticas, sueño y vínculos seguros modifican de forma medible los patrones hormonales e inmunes.",
        "Si un síntoma vuelve a pesar de estudios médicos limpios, pregunta: ¿qué intenta proteger o expresar esta parte de mi cuerpo? La curiosidad sirve más que el juicio.",
      ],
      takeaways: [
        "El estrés crónico altera hormonas e inmunidad, no solo el ánimo.",
        "Respiración, sueño y vínculos seguros cambian el sistema nervioso.",
        "Los síntomas pueden traer información que vale la pena escuchar.",
        "La curiosidad le gana a la autoculpa, siempre.",
      ],
    },
  },
  {
    slug: "reclaiming-the-erotic",
    emoji: "🌹",
    category: "Lifestyle",
    readTime: "4 min",
    source: { book: "Women's Bodies, Women's Wisdom", author: "Christiane Northrup, M.D." },
    en: {
      title: "Reclaiming the Erotic — Beyond Sex",
      summary:
        "The erotic, in Northrup's framing, is the full life force — pleasure, creativity, appetite, presence. Reclaiming it is a health practice, not a luxury.",
      body: [
        "Many women learn early to outsource pleasure: to wait for permission, to perform rather than feel, to apologize for desire. Over time this disconnects you from a powerful internal compass.",
        "Erotic intelligence shows up in small choices: what you eat, how you move, what you make, who you let close. Pleasure that you actually feel — not perform — regulates the nervous system and supports hormonal health.",
        "A starting practice: once a day, ask 'what would feel good right now?' and follow the answer for 10 minutes. The point is reconnection, not reward.",
      ],
      takeaways: [
        "The 'erotic' is broader than sex — it's life force.",
        "Felt pleasure regulates the nervous system.",
        "Small daily acts of pleasure rebuild the connection.",
        "Desire is information, not a problem.",
      ],
    },
    es: {
      title: "Recuperar lo erótico — más allá del sexo",
      summary:
        "Para Northrup, lo erótico es toda la fuerza vital: placer, creatividad, apetito, presencia. Recuperarlo es una práctica de salud, no un lujo.",
      body: [
        "Muchas mujeres aprenden pronto a delegar el placer: esperar permiso, actuar en lugar de sentir, disculparse por el deseo. Con el tiempo eso te desconecta de una brújula interna muy potente.",
        "La inteligencia erótica aparece en decisiones pequeñas: lo que comes, cómo te mueves, lo que creas, a quién dejas cerca. El placer que de verdad sientes — no el actuado — regula el sistema nervioso y sostiene la salud hormonal.",
        "Práctica inicial: una vez al día, pregúntate '¿qué me sentaría bien ahora?' y sigue la respuesta durante 10 minutos. El objetivo es reconectar, no recompensarte.",
      ],
      takeaways: [
        "Lo 'erótico' es más amplio que el sexo: es fuerza vital.",
        "El placer sentido regula el sistema nervioso.",
        "Pequeños actos diarios de placer reconstruyen la conexión.",
        "El deseo es información, no un problema.",
      ],
    },
  },

  // ---------------- WomanCode — Alisa Vitti ----------------
  {
    slug: "cycle-syncing-101",
    emoji: "🔄",
    category: "Lifestyle",
    readTime: "5 min",
    source: { book: "WomanCode", author: "Alisa Vitti" },
    en: {
      title: "Cycle Syncing 101: Living in the FLO",
      summary:
        "Vitti's central idea: women have two clocks, not one. Aligning food, movement, and work with each phase reduces symptoms and unlocks energy.",
      body: [
        "Men run on a roughly 24-hour hormonal rhythm. Women have that plus a 28-ish-day infradian rhythm. Treating every day the same is the equivalent of running a 28-day operating system on 24-hour rules.",
        "Follicular: high creativity, plan and start new projects, lighter foods, try new workouts. Ovulatory: peak communication and energy, schedule big meetings, intense training, fresh produce. Luteal: detail and execution work, strength training tapering to gentle, root vegetables and complex carbs. Menstrual: rest, review, restorative movement, warm iron-rich foods.",
        "You don't have to overhaul your life. Pick one lever — workouts, big meetings, or grocery list — and align that lever with your phase for one cycle.",
      ],
      takeaways: [
        "Women have a 28-day infradian rhythm on top of the 24-hour one.",
        "Each phase favors different food, movement, and work.",
        "Start small: align one habit, not your whole life.",
        "One full cycle is enough to feel the difference.",
      ],
    },
    es: {
      title: "Sincronización con el ciclo 101: vivir en el FLO",
      summary:
        "La idea central de Vitti: las mujeres tienen dos relojes, no uno. Alinear comida, ejercicio y trabajo con cada fase reduce síntomas y libera energía.",
      body: [
        "Los hombres funcionan con un ritmo hormonal de unas 24 horas. Las mujeres tienen ese más un ritmo infradiano de unos 28 días. Tratar todos los días igual es como correr un sistema operativo de 28 días con reglas de 24 horas.",
        "Folicular: alta creatividad, planifica y arranca proyectos, comidas ligeras, prueba nuevos entrenamientos. Ovulatoria: comunicación y energía pico, agenda reuniones importantes, entrenamiento intenso, vegetales frescos. Lútea: trabajo de detalle y ejecución, fuerza que baja a movimiento suave, tubérculos y carbohidratos complejos. Menstrual: descanso, revisión, movimiento restaurador, comidas tibias ricas en hierro.",
        "No tienes que reorganizar toda tu vida. Elige una palanca — ejercicio, reuniones importantes o la lista del súper — y alinéala con tu fase durante un ciclo.",
      ],
      takeaways: [
        "Las mujeres tienen un ritmo infradiano de 28 días además del de 24 horas.",
        "Cada fase favorece comida, movimiento y trabajo distintos.",
        "Empieza pequeño: alinea un hábito, no toda tu vida.",
        "Un ciclo completo basta para notar la diferencia.",
      ],
    },
  },
  {
    slug: "five-step-protocol-foundations",
    emoji: "🌱",
    category: "Nutrition",
    readTime: "5 min",
    source: { book: "WomanCode", author: "Alisa Vitti" },
    en: {
      title: "The Foundations of Hormonal Balance",
      summary:
        "Before any fancy supplement, four foundations decide whether your hormones thrive: blood sugar, adrenals, elimination, and a phase-aware diet.",
      body: [
        "1) Stabilize blood sugar. Skipping meals or running on coffee spikes cortisol and disrupts every downstream hormone. Eat a real breakfast within 90 minutes of waking, with protein and fat.",
        "2) Nurture adrenals. Constant stress steals raw materials your sex hormones need. Non-negotiables: sleep before midnight, daylight in the morning, and short recovery breaks.",
        "3) Support elimination. Used estrogens leave the body via the liver and gut. Daily fiber, water, and bowel movements are hormone health, not just digestion.",
        "4) Eat for your phase. Match foods to where you are in your cycle (see Cycle Syncing 101).",
      ],
      takeaways: [
        "Eat a protein-and-fat breakfast within 90 minutes of waking.",
        "Sleep, daylight, and breaks protect adrenals.",
        "Daily bowel movements are hormone hygiene.",
        "Phase-based eating beats generic meal plans.",
      ],
    },
    es: {
      title: "Las bases del equilibrio hormonal",
      summary:
        "Antes de cualquier suplemento elegante, cuatro bases deciden si tus hormonas prosperan: glucosa, suprarrenales, eliminación y una alimentación según la fase.",
      body: [
        "1) Estabiliza la glucosa. Saltarte comidas o vivir de café dispara el cortisol y altera todas las hormonas que vienen después. Desayuna de verdad en los primeros 90 minutos del día, con proteína y grasa.",
        "2) Cuida las suprarrenales. El estrés constante consume las materias primas que necesitan tus hormonas sexuales. Innegociables: dormir antes de medianoche, luz natural por la mañana y pausas cortas de recuperación.",
        "3) Apoya la eliminación. Los estrógenos usados salen del cuerpo por hígado e intestino. Fibra, agua y deposiciones diarias son salud hormonal, no solo digestión.",
        "4) Come según tu fase. Ajusta los alimentos al momento del ciclo (ver Sincronización con el ciclo 101).",
      ],
      takeaways: [
        "Desayuna proteína y grasa en los primeros 90 minutos.",
        "Sueño, luz y pausas protegen las suprarrenales.",
        "Las deposiciones diarias son higiene hormonal.",
        "Comer por fases supera a los planes genéricos.",
      ],
    },
  },
  {
    slug: "pcos-beyond-the-pill",
    emoji: "💊",
    category: "Education",
    readTime: "5 min",
    source: { book: "WomanCode", author: "Alisa Vitti" },
    en: {
      title: "PCOS: Beyond Just 'Take the Pill'",
      summary:
        "Polycystic ovary syndrome is often managed by suppressing symptoms with the pill. Vitti's argument: address the underlying drivers — insulin, inflammation, and stress.",
      body: [
        "PCOS isn't a disease of the ovaries alone. It's a metabolic and endocrine pattern in which insulin resistance pushes the ovaries to overproduce androgens, disrupting ovulation.",
        "Birth control can mask symptoms by overriding your cycle, but it doesn't address insulin resistance. When the pill is stopped, symptoms often return — sometimes worse.",
        "Levers that move PCOS: lower-glycemic eating, strength training, sleep regularity, and targeted nutrients (inositol, magnesium, vitamin D where deficient). Many women see meaningful change within 3–6 cycles.",
        "If you're on the pill and it's working for you, that's a valid choice. The point is informed choice — knowing what is being managed and what is being masked.",
      ],
      takeaways: [
        "PCOS is driven by insulin and inflammation, not 'bad ovaries.'",
        "The pill masks symptoms; it doesn't fix the root cause.",
        "Diet, strength training, and sleep meaningfully shift PCOS.",
        "Informed choice is the goal — not pill vs. no-pill.",
      ],
    },
    es: {
      title: "SOP: más allá de 'toma la píldora'",
      summary:
        "El síndrome de ovario poliquístico suele manejarse suprimiendo síntomas con la píldora. La propuesta de Vitti: ir a los detonantes — insulina, inflamación y estrés.",
      body: [
        "El SOP no es una enfermedad solo de los ovarios. Es un patrón metabólico y endocrino en el que la resistencia a la insulina empuja a los ovarios a producir andrógenos en exceso, alterando la ovulación.",
        "La píldora puede enmascarar síntomas al sobreescribir tu ciclo, pero no corrige la resistencia a la insulina. Cuando se suspende, los síntomas suelen volver — a veces peor.",
        "Palancas que mueven el SOP: alimentación de bajo índice glucémico, entrenamiento de fuerza, regularidad del sueño y nutrientes dirigidos (inositol, magnesio, vitamina D si hay déficit). Muchas mujeres notan cambios significativos en 3 a 6 ciclos.",
        "Si tomas la píldora y te funciona, es una decisión válida. La meta es la decisión informada — saber qué se está gestionando y qué se está tapando.",
      ],
      takeaways: [
        "El SOP lo conducen la insulina y la inflamación, no 'ovarios malos'.",
        "La píldora enmascara síntomas; no resuelve la causa raíz.",
        "Dieta, fuerza y sueño cambian de forma significativa el SOP.",
        "La meta es la decisión informada, no píldora vs. no-píldora.",
      ],
    },
  },

  // ---------------- New Dimensions in Women's Health — Alexander et al. ----------------
  {
    slug: "prevention-over-treatment",
    emoji: "🛡️",
    category: "Wellness",
    readTime: "5 min",
    source: { book: "New Dimensions in Women's Health", author: "Alexander, LaRosa, Bader, Garfield, Alexander" },
    en: {
      title: "The Quiet Power of Prevention",
      summary:
        "Most of what shapes long-term health for women is decided before any diagnosis: nutrition, movement, sleep, screening, and not smoking.",
      body: [
        "Public health data is consistent: a small set of behaviors prevents the majority of chronic disease. Daily movement, mostly-plant eating, normal weight, no smoking, moderate or no alcohol, and regular screening together cut lifetime risk of heart disease, type 2 diabetes, and several cancers dramatically.",
        "Women's bodies face unique screening windows: cervical screening, breast imaging at age-appropriate intervals, blood pressure, cholesterol, fasting glucose, bone density at menopause, and mental health check-ins at every life stage.",
        "Build a one-page personal health calendar: what gets checked, when, and where the result lives. It's the cheapest, most effective tool in this whole list.",
      ],
      takeaways: [
        "A few habits prevent most chronic disease.",
        "Cervical, breast, BP, lipids, glucose, and bone are key screens.",
        "Mental health screening matters at every age.",
        "A personal one-page health calendar beats memory.",
      ],
    },
    es: {
      title: "El poder silencioso de la prevención",
      summary:
        "Gran parte de la salud a largo plazo de las mujeres se decide antes de cualquier diagnóstico: nutrición, movimiento, sueño, tamizajes y no fumar.",
      body: [
        "Los datos de salud pública son consistentes: un pequeño grupo de conductas previene la mayoría de las enfermedades crónicas. Movimiento diario, alimentación mayormente vegetal, peso saludable, no fumar, alcohol moderado o nulo y tamizajes regulares reducen drásticamente el riesgo de enfermedad cardíaca, diabetes tipo 2 y varios cánceres.",
        "El cuerpo femenino tiene ventanas de tamizaje únicas: citología, imágenes mamarias a edades apropiadas, presión arterial, colesterol, glucosa en ayunas, densidad ósea en la menopausia y revisiones de salud mental en cada etapa.",
        "Arma un calendario personal de salud de una página: qué se revisa, cuándo y dónde queda el resultado. Es la herramienta más barata y eficaz de toda esta lista.",
      ],
      takeaways: [
        "Pocos hábitos previenen la mayoría de enfermedades crónicas.",
        "Citología, mama, presión, lípidos, glucosa y hueso son tamizajes clave.",
        "El tamizaje de salud mental importa en toda edad.",
        "Un calendario personal de salud de una página le gana a la memoria.",
      ],
    },
  },
  {
    slug: "social-determinants-of-womens-health",
    emoji: "🌍",
    category: "Equity",
    readTime: "5 min",
    source: { book: "New Dimensions in Women's Health", author: "Alexander, LaRosa, Bader, Garfield, Alexander" },
    en: {
      title: "Health Is More Than Healthcare",
      summary:
        "Income, housing, safety, education, and access shape health outcomes more than any single doctor's visit.",
      body: [
        "Public-health research keeps confirming the same finding: clinical care accounts for only about 20% of health outcomes. The rest comes from social and economic conditions, the physical environment, and individual behaviors that those conditions enable or block.",
        "For women, structural pieces matter especially: paid leave, safe housing, access to contraception and prenatal care, freedom from violence, and equal pay. These aren't 'lifestyle' issues — they are upstream determinants of cardiovascular, mental, and reproductive health.",
        "On a personal level, this means asking for help is medicine. Connecting with a community clinic, a domestic violence hotline, a food program, or a benefits navigator can move your health more than any new supplement.",
      ],
      takeaways: [
        "Clinical care is only ~20% of what shapes health.",
        "Income, safety, and access drive most outcomes.",
        "Asking for structural help is a health intervention.",
        "Community resources are part of your care plan.",
      ],
    },
    es: {
      title: "La salud es mucho más que la atención médica",
      summary:
        "Ingreso, vivienda, seguridad, educación y acceso moldean la salud más que cualquier consulta médica aislada.",
      body: [
        "La investigación en salud pública lo repite: la atención clínica explica solo alrededor del 20% de los resultados en salud. El resto viene de condiciones sociales y económicas, el entorno físico y los comportamientos que esas condiciones habilitan o bloquean.",
        "Para las mujeres, las piezas estructurales pesan especialmente: licencia pagada, vivienda segura, acceso a anticoncepción y atención prenatal, vida libre de violencia y salario igualitario. No son temas de 'estilo de vida' — son determinantes upstream de salud cardiovascular, mental y reproductiva.",
        "En lo personal, pedir ayuda es medicina. Conectarte con una clínica comunitaria, una línea contra la violencia, un programa alimentario o una orientadora de beneficios puede mover tu salud más que cualquier suplemento nuevo.",
      ],
      takeaways: [
        "La atención clínica es solo ~20% de lo que define la salud.",
        "Ingreso, seguridad y acceso explican la mayor parte.",
        "Pedir ayuda estructural es una intervención de salud.",
        "Los recursos comunitarios son parte de tu plan de cuidado.",
      ],
    },
  },
];

export const getArticleBySlug = (slug: string): Article | undefined =>
  articles.find((a) => a.slug === slug);
