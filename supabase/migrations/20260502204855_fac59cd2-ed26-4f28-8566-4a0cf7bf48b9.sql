REVOKE EXECUTE ON FUNCTION public.search_users_for_friends(text) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.get_accepted_friend_ids(uuid) FROM anon, public;
REVOKE EXECUTE ON FUNCTION public.womb_providers_within_radius(numeric, numeric, numeric, public.womb_care_category) FROM anon, public;

GRANT EXECUTE ON FUNCTION public.search_users_for_friends(text) TO authenticated;
GRANT EXECUTE ON FUNCTION public.get_accepted_friend_ids(uuid) TO authenticated;
GRANT EXECUTE ON FUNCTION public.womb_providers_within_radius(numeric, numeric, numeric, public.womb_care_category) TO authenticated;