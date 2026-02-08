DROP TRIGGER IF EXISTS trg_protect_points_cache ON public.profiles;
CREATE TRIGGER trg_protect_points_cache
BEFORE UPDATE ON public.profiles
FOR EACH ROW
EXECUTE FUNCTION public.protect_points_cache();
