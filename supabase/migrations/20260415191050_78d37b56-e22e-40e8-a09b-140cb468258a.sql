
-- Add age_group column to profiles
ALTER TABLE public.profiles ADD COLUMN age_group text;

-- Create learn_resources table
CREATE TABLE public.learn_resources (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title text NOT NULL,
  description text,
  content text,
  category text NOT NULL,
  age_groups text[] NOT NULL DEFAULT '{}',
  lang text NOT NULL DEFAULT 'en',
  icon text,
  sort_order integer NOT NULL DEFAULT 0,
  created_at timestamp with time zone NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.learn_resources ENABLE ROW LEVEL SECURITY;

-- All authenticated users can read resources
CREATE POLICY "Authenticated users can view resources"
ON public.learn_resources
FOR SELECT
TO authenticated
USING (true);

-- Seed starter content - English
INSERT INTO public.learn_resources (title, description, category, age_groups, lang, icon, sort_order) VALUES
-- 12-16: Puberty & basics
('Understanding Puberty', 'What''s happening to your body and why — a friendly guide to growing up.', 'hormones', ARRAY['12-16'], 'en', 'Sprout', 1),
('Your First Period Guide', 'Everything you need to know about your first period — products, pain relief, and what''s normal.', 'hormones', ARRAY['12-16'], 'en', 'Heart', 2),
('Understanding Your Cycle', 'Learn the four phases of your menstrual cycle in simple terms.', 'hormones', ARRAY['12-16','17-24'], 'en', 'RefreshCw', 3),
('Emotional Changes & Mood', 'Why you feel different during your cycle and how to handle big emotions.', 'mental_health', ARRAY['12-16'], 'en', 'Smile', 4),

-- 17-24: Deep dive
('Hormones Deep Dive', 'A detailed look at estrogen, progesterone, and testosterone and how they shape your month.', 'hormones', ARRAY['17-24','25-30'], 'en', 'Brain', 5),
('Birth Control Options', 'An honest guide to hormonal and non-hormonal birth control methods.', 'birth_control', ARRAY['17-24','25-30','30-35'], 'en', 'Shield', 6),
('Mental Health Toolkit', 'Breathing exercises, journaling prompts, and coping strategies for stress and anxiety.', 'mental_health', ARRAY['17-24','25-30','30-35','35-45'], 'en', 'Wind', 7),
('Nutrition for Your Cycle', 'What to eat during each phase for energy, mood, and hormone balance.', 'hormones', ARRAY['17-24','25-30','30-35'], 'en', 'Apple', 8),

-- 25-30: Fertility awareness intro
('Fertility Awareness Basics', 'Introduction to tracking ovulation signs and understanding your fertile window.', 'fertility', ARRAY['25-30','30-35'], 'en', 'HeartPulse', 9),
('Cycle Syncing Your Lifestyle', 'Align workouts, nutrition, and productivity with your cycle phases.', 'hormones', ARRAY['25-30','30-35','35-45'], 'en', 'RefreshCw', 10),
('Career & Wellness Balance', 'How to work with your cycle, not against it, for peak performance.', 'mental_health', ARRAY['25-30','30-35'], 'en', 'Briefcase', 11),

-- 30-35: Fertility planning
('Fertility Planning Guide', 'When to start thinking about fertility, key tests, and what your doctor should know.', 'fertility', ARRAY['30-35','35-45'], 'en', 'Baby', 12),
('Egg Freezing 101', 'The process, timeline, costs, and what to expect — a practical overview.', 'fertility', ARRAY['30-35','35-45'], 'en', 'Snowflake', 13),
('Hormone Optimization', 'Lifestyle and supplement strategies to support hormonal balance in your 30s.', 'hormones', ARRAY['30-35','35-45'], 'en', 'Sparkles', 14),

-- 35-45: Perimenopause intro
('Advanced Fertility Options', 'IVF, IUI, and assisted reproduction — what you need to know.', 'fertility', ARRAY['35-45'], 'en', 'Baby', 15),
('Perimenopause: What to Expect', 'Early signs, hormone shifts, and how to prepare for this transition.', 'hormones', ARRAY['35-45','45-55'], 'en', 'Thermometer', 16),
('Preventive Health Screenings', 'Key health screenings and check-ups for women 35+.', 'hormones', ARRAY['35-45','45-55'], 'en', 'Stethoscope', 17),

-- 45-55: Perimenopause management
('Managing Perimenopause', 'Hot flashes, sleep issues, mood changes — practical strategies that work.', 'hormones', ARRAY['45-55'], 'en', 'Flame', 18),
('HRT: Facts & Options', 'Hormone replacement therapy explained — benefits, risks, and types.', 'hormones', ARRAY['45-55','55-65'], 'en', 'Pill', 19),
('Bone Health & Strength', 'Protecting your bones during and after menopause with diet and exercise.', 'hormones', ARRAY['45-55','55-65'], 'en', 'Dumbbell', 20),
('Emotional Wellness in Midlife', 'Navigating identity shifts, relationships, and self-care during perimenopause.', 'mental_health', ARRAY['45-55'], 'en', 'Heart', 21),

-- 55-65: Menopause & beyond
('Menopause Support Guide', 'Living well after menopause — symptoms management and thriving.', 'hormones', ARRAY['55-65'], 'en', 'Sun', 22),
('Post-Menopause Health', 'Heart health, bone density, and staying active in your 50s and 60s.', 'hormones', ARRAY['55-65'], 'en', 'HeartPulse', 23),
('Vitality & Longevity Tips', 'Evidence-based strategies for energy, cognitive health, and vitality.', 'mental_health', ARRAY['55-65'], 'en', 'Zap', 24),

-- Spanish versions
('Entendiendo la Pubertad', 'Qué le está pasando a tu cuerpo y por qué — una guía amigable para crecer.', 'hormones', ARRAY['12-16'], 'es', 'Sprout', 1),
('Tu Primera Menstruación', 'Todo lo que necesitas saber sobre tu primera regla — productos, alivio del dolor y qué es normal.', 'hormones', ARRAY['12-16'], 'es', 'Heart', 2),
('Entendiendo Tu Ciclo', 'Aprende las cuatro fases de tu ciclo menstrual en términos simples.', 'hormones', ARRAY['12-16','17-24'], 'es', 'RefreshCw', 3),
('Cambios Emocionales', 'Por qué te sientes diferente durante tu ciclo y cómo manejar emociones grandes.', 'mental_health', ARRAY['12-16'], 'es', 'Smile', 4),
('Hormonas a Fondo', 'Un vistazo detallado al estrógeno, progesterona y testosterona.', 'hormones', ARRAY['17-24','25-30'], 'es', 'Brain', 5),
('Opciones Anticonceptivas', 'Una guía honesta sobre métodos anticonceptivos hormonales y no hormonales.', 'birth_control', ARRAY['17-24','25-30','30-35'], 'es', 'Shield', 6),
('Kit de Salud Mental', 'Ejercicios de respiración, diario y estrategias para el estrés.', 'mental_health', ARRAY['17-24','25-30','30-35','35-45'], 'es', 'Wind', 7),
('Nutrición para Tu Ciclo', 'Qué comer en cada fase para energía, ánimo y equilibrio hormonal.', 'hormones', ARRAY['17-24','25-30','30-35'], 'es', 'Apple', 8),
('Conciencia de Fertilidad', 'Introducción al seguimiento de signos de ovulación.', 'fertility', ARRAY['25-30','30-35'], 'es', 'HeartPulse', 9),
('Sincronización del Ciclo', 'Alinea ejercicio, nutrición y productividad con las fases de tu ciclo.', 'hormones', ARRAY['25-30','30-35','35-45'], 'es', 'RefreshCw', 10),
('Equilibrio Carrera y Bienestar', 'Cómo trabajar con tu ciclo para máximo rendimiento.', 'mental_health', ARRAY['25-30','30-35'], 'es', 'Briefcase', 11),
('Guía de Planificación Familiar', 'Cuándo empezar a pensar en fertilidad y qué debe saber tu médico.', 'fertility', ARRAY['30-35','35-45'], 'es', 'Baby', 12),
('Congelación de Óvulos 101', 'El proceso, cronograma, costos y qué esperar.', 'fertility', ARRAY['30-35','35-45'], 'es', 'Snowflake', 13),
('Optimización Hormonal', 'Estrategias de estilo de vida y suplementos para el equilibrio hormonal.', 'hormones', ARRAY['30-35','35-45'], 'es', 'Sparkles', 14),
('Opciones Avanzadas de Fertilidad', 'FIV, IIU y reproducción asistida — lo que necesitas saber.', 'fertility', ARRAY['35-45'], 'es', 'Baby', 15),
('Perimenopausia: Qué Esperar', 'Primeros signos, cambios hormonales y cómo prepararte.', 'hormones', ARRAY['35-45','45-55'], 'es', 'Thermometer', 16),
('Exámenes Preventivos', 'Exámenes y chequeos clave para mujeres de 35+.', 'hormones', ARRAY['35-45','45-55'], 'es', 'Stethoscope', 17),
('Manejo de la Perimenopausia', 'Bochornos, insomnio, cambios de ánimo — estrategias prácticas.', 'hormones', ARRAY['45-55'], 'es', 'Flame', 18),
('TRH: Datos y Opciones', 'Terapia de reemplazo hormonal explicada — beneficios, riesgos y tipos.', 'hormones', ARRAY['45-55','55-65'], 'es', 'Pill', 19),
('Salud Ósea y Fuerza', 'Protege tus huesos durante y después de la menopausia.', 'hormones', ARRAY['45-55','55-65'], 'es', 'Dumbbell', 20),
('Bienestar Emocional', 'Navegando cambios de identidad y autocuidado durante la perimenopausia.', 'mental_health', ARRAY['45-55'], 'es', 'Heart', 21),
('Guía de Apoyo en la Menopausia', 'Vivir bien después de la menopausia.', 'hormones', ARRAY['55-65'], 'es', 'Sun', 22),
('Salud Post-Menopausia', 'Salud cardíaca, densidad ósea y mantenerse activa.', 'hormones', ARRAY['55-65'], 'es', 'HeartPulse', 23),
('Vitalidad y Longevidad', 'Estrategias basadas en evidencia para energía y salud cognitiva.', 'mental_health', ARRAY['55-65'], 'es', 'Zap', 24);
