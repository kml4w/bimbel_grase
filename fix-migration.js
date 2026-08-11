const fs = require('fs');

const path = 'd:\\bimble grase _kamila_bogor\\supabase\\migrations\\20260810102200_elearning_tables.sql';
let content = fs.readFileSync(path, 'utf8');

content = content.replace(/CREATE POLICY "([^"]+)" ON public\.([a-zA-Z0-9_]+)/g, 'DROP POLICY IF EXISTS "$1" ON public.$2;\nCREATE POLICY "$1" ON public.$2');

// Fix the one I already modified
content = content.replace(/DO \$\$ BEGIN\s+IF NOT EXISTS \([\s\S]+?END IF;\s+END \$\$;/m, `DROP POLICY IF EXISTS "Admins can manage assignments" ON public.assignments;
CREATE POLICY "Admins can manage assignments" ON public.assignments
    FOR ALL USING (
        EXISTS (SELECT 1 FROM public.profiles WHERE id = auth.uid() AND role = 'admin')
    );`);

fs.writeFileSync(path, content);
console.log('Fixed policies in 20260810102200_elearning_tables.sql');
