
DROP FUNCTION IF EXISTS public.search_users_for_friends(text);
CREATE FUNCTION public.search_users_for_friends(search_query text)
RETURNS TABLE(id uuid, display_name text, full_name text)
LANGUAGE sql
STABLE SECURITY DEFINER
SET search_path TO 'public'
AS $function$
  SELECT p.id, p.display_name, p.full_name
  FROM public.profiles p
  WHERE p.id <> auth.uid()
    AND length(btrim(search_query)) >= 3
    AND (
      p.display_name ILIKE btrim(search_query) || '%'
      OR p.full_name  ILIKE btrim(search_query) || '%'
      OR p.email = lower(btrim(search_query))
    )
  LIMIT 20;
$function$;
