
-- NOTE: These inserts rely on the AUTH user already existing.
-- In a real Supabase workflow, you create the Auth user first, then insert into public.users.
-- Since this is a migration file, we can't easily create auth users via SQL without knowing their IDs.
-- However, we can set up a trigger to handle new user creation sync, or manually insert if IDs are known.

-- This migration assumes you will run the `authService.signUp` function or create users in the dashboard.
-- Below is a helper function to ensure roles are assigned correctly when specific emails register.

CREATE OR REPLACE FUNCTION public.handle_new_user_roles() 
RETURNS TRIGGER AS $$
BEGIN
    IF new.email = 'Anthony.aacdm@gmail.com' THEN
        UPDATE public.users 
        SET role = 'master', cpf = '00000000000', phone = '81997015454', name = 'Anthony'
        WHERE id = new.id;
    ELSIF new.email = 'Anthonyandrewcdm@gmail.com' THEN
        UPDATE public.users 
        SET role = 'admin', cpf = '11111111111', phone = '81997015454', name = 'Andrew'
        WHERE id = new.id;
    END IF;
    RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Trigger to run after a row is inserted into public.users
DROP TRIGGER IF EXISTS on_public_user_created ON public.users;
CREATE TRIGGER on_public_user_created
    AFTER INSERT ON public.users
    FOR EACH ROW EXECUTE PROCEDURE public.handle_new_user_roles();
