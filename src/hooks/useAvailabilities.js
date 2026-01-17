import { useEffect, useMemo, useState } from "react";
import { supabase } from "@/lib/supabaseClient";

/**
 * Carrega disponibilidades do "provider" (master/admin).
 * - Master/Admin: vê e gerencia as próprias disponibilidades (admin_id = auth.uid()).
 * - Usuário comum: vê disponibilidades do MASTER definido em VITE_MASTER_USER_ID.
 *
 * Retorna SEMPRE arrays (nunca undefined) para evitar tela branca.
 */
export function useAvailabilities(currentUser) {
  const [availabilities, setAvailabilities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const masterId = import.meta.env.VITE_MASTER_USER_ID;

  const role = useMemo(() => currentUser?.role ?? null, [currentUser]);
  const uid = useMemo(() => currentUser?.id ?? null, [currentUser]);

  const providerId = useMemo(() => {
    if (role === "master" || role === "admin") return uid;     // gerencia o próprio
    return masterId || null;                                    // usuário comum enxerga do master
  }, [role, uid, masterId]);

  useEffect(() => {
    let mounted = true;

    async function load() {
      setLoading(true);
      setError(null);

      try {
        if (!providerId) {
          // Sem provider definido => não quebra a tela
          if (mounted) setAvailabilities([]);
          return;
        }

        const { data, error: err } = await supabase
          .from("availabilities")
          .select("*")
          .eq("admin_id", providerId)
          .eq("active", true)
          .order("day_of_week", { ascending: true })
          .order("start_time", { ascending: true });

        if (err) throw err;

        if (mounted) setAvailabilities(Array.isArray(data) ? data : []);
      } catch (e) {
        console.error("useAvailabilities error:", e);
        if (mounted) {
          setAvailabilities([]); // nunca deixa undefined
          setError(e);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    }

    load();

    return () => {
      mounted = false;
    };
  }, [providerId]);

  return {
    availabilities: Array.isArray(availabilities) ? availabilities : [],
    loading,
    error,
    providerId,
  };
}
