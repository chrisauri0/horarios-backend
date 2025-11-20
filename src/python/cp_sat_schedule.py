

from ortools.sat.python import cp_model
import json


SLOTS_PER_DAY = 5  # 17,18,19,20,21
DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie"]
SLOTS = [f"{d}{17+i}" for d in DAYS for i in range(SLOTS_PER_DAY)]  # 25 slots
slot2day = {s: (s[:3], int(s[3:]) - 17) for s in SLOTS}


SUBJECTS = {
    "IDGS15": [
        {"id": "administracion del tiempo", "H": 3, "rooms": ["Aula 12 edificio k"], "profs": ["Maria Guadalupe"]},
        {"id": "Matematicas para ingenieria", "H": 4, "rooms": ["Aula 11 edificio k"], "profs": ["Jesus Hernan"]},
        {"id": "Arquitectura de software", "H": 5, "rooms": ["Aula 11 edificio I"], "profs": ["Manuel"]},
        {"id": "Ingles", "H": 4, "rooms": ["Aula 13 edificio k"], "profs": ["Profe Ingles1"]},
        {"id": "Metodologia de desarrollo de proyectos", "H": 3, "rooms": ["SUMPA edificio k",], "profs": ["Angelica"]},
        {"id": "Experiencia de usuario", "H": 3, "rooms": ["Aula 10 edificio j"], "profs": ["Emmanuel"]},
        {"id": "Seguridad informatica", "H": 3, "rooms": ["Aula 12 edificio j"], "profs": ["Brandon"]},
    ],
    "IDGS16": [
       {"id": "administracion del tiempo", "H": 3, "rooms": ["Aula 12 edificio k"], "profs": ["Maria Guadalupe"]},
        {"id": "Matematicas para ingenieria", "H": 4, "rooms": ["Aula 11 edificio k"], "profs": ["Jesus Hernan"]},
        {"id": "Arquitectura de software", "H": 5, "rooms": ["Aula 11 edificio I"], "profs": ["Manuel"]},
        {"id": "Ingles", "H": 4, "rooms": ["Aula 13 edificio k"], "profs": ["Profe Ingles2"]},
        {"id": "Metodologia de desarrollo de proyectos", "H": 3, "rooms": ["SUMPA edificio k",], "profs": ["Angelica"]},
        {"id": "Experiencia de usuario", "H": 3, "rooms": ["Aula 10 edificio j"], "profs": ["Emmanuel"]},
        {"id": "Seguridad informatica", "H": 3, "rooms": ["Aula 12 edificio j"], "profs": ["Brandon"]},
    ],
    "IDGS14": [
{"id": "administracion del tiempo", "H": 3, "rooms": ["Aula 12 edificio k"], "profs": ["Maria Guadalupe"]},
        {"id": "Matematicas para ingenieria", "H": 4, "rooms": ["Aula 11 edificio k"], "profs": ["Jesus Hernan"]},
        {"id": "Arquitectura de software", "H": 5, "rooms": ["Aula 11 edificio I"], "profs": ["Manuel"]},
        {"id": "Ingles", "H": 4, "rooms": ["Aula 13 edificio k"], "profs": ["Profe Ingles3"]},
        {"id": "Metodologia de desarrollo de proyectos", "H": 3, "rooms": ["SUMPA edificio k",], "profs": ["Angelica"]},
        {"id": "Experiencia de usuario", "H": 3, "rooms": ["Aula 10 edificio j"], "profs": ["Emmanuel"]},
        {"id": "Seguridad informatica", "H": 3, "rooms": ["Aula 12 edificio j"], "profs": ["Brandon"]},
    ],
    "IDGS17": [
  {"id": "administracion del tiempo", "H": 3, "rooms": ["Aula 12 edificio k"], "profs": ["Maria Guadalupe"]},
        {"id": "Matematicas para ingenieria", "H": 4, "rooms": ["Aula 11 edificio k"], "profs": ["Jesus Hernan"]},
        {"id": "Arquitectura de software", "H": 5, "rooms": ["Aula 11 edificio I"], "profs": ["Manuel"]},
        {"id": "Ingles", "H": 4, "rooms": ["Aula 13 edificio k"], "profs": ["Profe Ingles4"]},
        {"id": "Metodologia de desarrollo de proyectos", "H": 3, "rooms": ["SUMPA edificio k",], "profs": ["Angelica"]},
        {"id": "Experiencia de usuario", "H": 3, "rooms": ["Aula 10 edificio j"], "profs": ["Emmanuel"]},
        {"id": "Seguridad informatica", "H": 3, "rooms": ["Aula 12 edificio j"], "profs": ["Brandon"]},
    ]
}


def generate_patterns(H, allow_spread=True):
    # Only allow units of max 2 hours
    patterns = []
    # Generate all possible patterns with 1s and 2s, no 3s or more
    def gen(current, rem):
        if rem == 0:
            patterns.append(list(current))
            return
        if rem >= 1:
            gen(current + [1], rem - 1)
        if rem >= 2:
            gen(current + [2], rem - 2)
    gen([], H)
    # Remove duplicates
    unique_patterns = []
    seen = set()
    for pat in patterns:
        key = tuple(pat)
        if key not in seen:
            seen.add(key)
            unique_patterns.append(pat)
    # Label patterns
    labeled_patterns = []
    for pat in unique_patterns:
        if all(x == 1 for x in pat):
            pname = "spread"
        elif all(x == 2 for x in pat):
            pname = "greedy"
        else:
            pname = "mixed"
        labeled_patterns.append((pname, pat))
    return labeled_patterns

# Build patterns and units
units = []
patterns_by_subj = {}
unit_counter = 0
for subj in SUBJECTS:
    g = subj["group"]
    key = (g, subj["id"])
    pats = generate_patterns(subj["H"], allow_spread=True)
    patterns_by_subj[key] = []
    for pidx, (pname, pat) in enumerate(pats):
        u_indices = []
        for u_local_idx, ulen in enumerate(pat):
            uid = f"u_{g}_{subj['id']}_pat{pidx}_#{u_local_idx}"
            units.append({
                "uid": uid,
                "group": g,
                "subj": subj["id"],
                "pat_key": f"pat{pidx}",
                "pat_idx": pidx,
                "len": ulen,
                "allowed_rooms": subj["rooms"],
                "allowed_profs": subj["profs"]
            })
            u_indices.append(unit_counter)
            unit_counter += 1
        patterns_by_subj[key].append({
            "pat_key": f"pat{pidx}",
            "pat_type": pname,
            "units": u_indices
        })

# Build model
model = cp_model.CpModel()

SLOT_INDEX = {s: i for i, s in enumerate(SLOTS)}
# Build room/prof indices from subjects
ROOMS = sorted({room for subj in SUBJECTS for room in subj["rooms"]})
PROFS = sorted({prof for subj in SUBJECTS for prof in subj["profs"]})
GROUPS = sorted({subj["group"] for subj in SUBJECTS})
ROOM_INDEX = {r: i for i, r in enumerate(ROOMS)}
PROF_INDEX = {p: i for i, p in enumerate(PROFS)}
GROUP_INDEX = {g: i for i, g in enumerate(GROUPS)}
UNIT_IDS = [u["uid"] for u in units]

# z variables
z_vars = {}
for key, pat_list in patterns_by_subj.items():
    g, subj = key
    for pat in pat_list:
        var = model.NewBoolVar(f"z_{g}_{subj}_{pat['pat_key']}")
        z_vars[(g, subj, pat['pat_key'])] = var
    model.Add(sum(z_vars[(g, subj, pat['pat_key'])] for pat in pat_list) == 1)

# x variables
x_vars = {}
for ui, u in enumerate(units):
    ulen = u["len"]
    allowed_rooms = u["allowed_rooms"]
    allowed_profs = u["allowed_profs"]
    for s_idx, s in enumerate(SLOTS):
        day = s[:3]; idx_in_day = int(s[3:]) - 17
        if ulen == 2 and idx_in_day >= SLOTS_PER_DAY - 1:
            continue
        for r in allowed_rooms:
            for p in allowed_profs:
                var = model.NewBoolVar(f"x_u{ui}_s{s}_r{r}_p{p}")
                x_vars[(ui, s_idx, ROOM_INDEX[r], PROF_INDEX[p])] = var
                zvar = z_vars[(u["group"], u["subj"], f"pat{u['pat_idx']}")]
                model.Add(var <= zvar)

# cada unidad asignada una vez si el patrón es elegido
for (g, subj), pat_list in patterns_by_subj.items():
    for pat in pat_list:
        zvar = z_vars[(g, subj, pat["pat_key"])]
        for ui in pat["units"]:
            sum_terms = []
            for (u_idx, s_idx, r_idx, p_idx), var in x_vars.items():
                if u_idx == ui:
                    sum_terms.append(var)
            if not sum_terms:
                model.Add(zvar == 0)
            else:
                model.Add(sum(sum_terms) == zvar)

# ocupación de aulas
for r_idx, r in enumerate(ROOMS):
    for t_idx, t in enumerate(SLOTS):
        occ_terms = []
        for (u_idx, s_idx, rr_idx, p_idx), var in x_vars.items():
            if rr_idx != r_idx: continue
            ulen = units[u_idx]["len"]
            if s_idx <= t_idx <= s_idx + ulen - 1:
                occ_terms.append(var)
        if occ_terms:
            model.Add(sum(occ_terms) <= 1)

# Ocupación de profesores
for p_idx, p in enumerate(PROFS):
    for t_idx, t in enumerate(SLOTS):
        occ_terms = []
        for (u_idx, s_idx, rr_idx, pp_idx), var in x_vars.items():
            if pp_idx != p_idx: continue
            ulen = units[u_idx]["len"]
            if s_idx <= t_idx <= s_idx + ulen - 1:
                occ_terms.append(var)
        if occ_terms:
            model.Add(sum(occ_terms) <= 1)

# Ocupación de grupos
for g_id in GROUPS:
    for t_idx, t in enumerate(SLOTS):
        occ_terms = []
        for (u_idx, s_idx, rr_idx, pp_idx), var in x_vars.items():
            if units[u_idx]["group"] != g_id: continue
            ulen = units[u_idx]["len"]
            if s_idx <= t_idx <= s_idx + ulen - 1:
                occ_terms.append(var)
        if occ_terms:
            model.Add(sum(occ_terms) <= 1)


# y variables por contigüidad
y_vars = {}
for g in GROUPS:
    g_id = g["id"]
    for d_idx, d in enumerate(DAYS):
        for idx_in_day in range(SLOTS_PER_DAY):
            y = model.NewBoolVar(f"y_{g_id}_{d}_{idx_in_day}")
            y_vars[(g_id, d_idx, idx_in_day)] = y
            occ_terms = []
            t_idx = d_idx * SLOTS_PER_DAY + idx_in_day
            for (u_idx, s_idx, rr_idx, pp_idx), var in x_vars.items():
                if units[u_idx]["group"] != g_id: continue
                ulen = units[u_idx]["len"]
                if s_idx <= t_idx <= s_idx + ulen - 1:
                    occ_terms.append(var)
            if occ_terms:
                model.AddMaxEquality(y, occ_terms)
            else:
                model.Add(y == 0)

# Restricción: no puede haber clases dispersas de una misma materia en un mismo día
for subj in SUBJECTS:
    g_id = subj["group"]
    subj_id = subj["id"]
    for d_idx, d in enumerate(DAYS):
        slots_in_day = [d_idx * SLOTS_PER_DAY + i for i in range(SLOTS_PER_DAY)]
        y_subj_slots = []
        for idx_in_day, t_idx in enumerate(slots_in_day):
            occ_terms = []
            for (u_idx, s_idx, rr_idx, pp_idx), var in x_vars.items():
                if units[u_idx]["group"] == g_id and units[u_idx]["subj"] == subj_id:
                    ulen = units[u_idx]["len"]
                    if s_idx <= t_idx <= s_idx + ulen - 1:
                        occ_terms.append(var)
            if occ_terms:
                y_subj = model.NewBoolVar(f"y_{g_id}_{subj_id}_{d}_{idx_in_day}")
                model.AddMaxEquality(y_subj, occ_terms)
            else:
                y_subj = model.NewBoolVar(f"y_{g_id}_{subj_id}_{d}_{idx_in_day}")
                model.Add(y_subj == 0)
            y_subj_slots.append(y_subj)
        for a in range(SLOTS_PER_DAY):
            for c in range(a+1, SLOTS_PER_DAY):
                for b in range(a+1, c):
                    model.Add(y_subj_slots[a] + y_subj_slots[c] - 1 <= y_subj_slots[b])





# contigüidad triple
for g in GROUPS:
    g_id = g["id"]
    for d_idx, d in enumerate(DAYS):
        for a in range(SLOTS_PER_DAY):
            for b in range(a+1, SLOTS_PER_DAY):
                for c in range(b+1, SLOTS_PER_DAY):
                    ya = y_vars[(g_id, d_idx, a)]
                    yb = y_vars[(g_id, d_idx, b)]
                    yc = y_vars[(g_id, d_idx, c)]
                    model.Add(ya + yc - 1 <= yb)

# indicadores de gaps
gap_terms = []
for g in GROUPS:
    g_id = g["id"]
    for d_idx, d in enumerate(DAYS):
        for a in range(SLOTS_PER_DAY):
            for b in range(a+1, SLOTS_PER_DAY):
                for c in range(b+1, SLOTS_PER_DAY):
                    ya = y_vars[(g_id, d_idx, a)]
                    yb = y_vars[(g_id, d_idx, b)]
                    yc = y_vars[(g_id, d_idx, c)]
                    g_abc = model.NewBoolVar(f"gap_{g_id}_{d}_{a}_{b}_{c}")
                    model.Add(g_abc <= ya)
                    model.Add(g_abc <= yc)
                    model.Add(g_abc + yb <= 1)
                    model.Add(g_abc >= ya + yc - 1 - yb)
                    gap_terms.append(g_abc)

# recopilación de penalizaciones por spread
spread_penalties = []
for (g, subj), pat_list in patterns_by_subj.items():
    for pat in pat_list:
        if pat["pat_type"] == "spread":
            zvar = z_vars[(g, subj, pat["pat_key"])]
            s_var = model.NewIntVar(0, 1, f"spread_pen_{g}_{subj}_{pat['pat_key']}")
            model.Add(s_var == 1 - zvar)
            spread_penalties.append(s_var)

W_GAP = 10
W_SPREAD = 1
model.Minimize(W_GAP * sum(gap_terms) + W_SPREAD * sum(spread_penalties))
solver = cp_model.CpSolver()
solver.parameters.max_time_in_seconds = 30.0
solver.parameters.num_search_workers = 8
print("Resolviendo... (max 30s)")
result = solver.Solve(model)

output = {}

if result in (cp_model.OPTIMAL, cp_model.FEASIBLE):
    print("Resultado:", "OPTIMAL" if result == cp_model.OPTIMAL else "FEASIBLE")
    assignments = []
    for (u_idx, s_idx, r_idx, p_idx), var in x_vars.items():
        if solver.Value(var) == 1:
            u = units[u_idx]
            s_name = SLOTS[s_idx]
            r_name = ROOMS[r_idx]
            p_name = PROFS[p_idx]
            assignments.append({
                "unit": u["uid"],
                "group": u["group"],
                "subj": u["subj"],
                "len": u["len"],
                "start": s_name,
                "room": r_name,
                "prof": p_name
            })
    chosen_patterns = []
    for (g, subj), pat_list in patterns_by_subj.items():
        for pat in pat_list:
            zvar = z_vars[(g, subj, pat["pat_key"])]
            if solver.Value(zvar) == 1:
                chosen_patterns.append({
                    "group": g,
                    "subj": subj,
                    "chosen": pat["pat_key"],
                    "type": pat["pat_type"]
                })

    output = {
        "status": "OK",
        "result": "OPTIMAL" if result == cp_model.OPTIMAL else "FEASIBLE",
        "assignments": assignments,
        "patterns": chosen_patterns
    }

    # Guardar también en archivo
    with open('resultado.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=4)

else:
    output = {
        "status": "NO_SOLUTION",
        "message": f"No se encontró solución factible en el tiempo límite ({solver.StatusName(result)})"
    }
    # Guardar también en archivo aunque no haya solución
    with open('resultado.json', 'w', encoding='utf-8') as f:
        json.dump(output, f, ensure_ascii=False, indent=4)

# 👇 Este print será el único que capture FastAPI
print(json.dumps(output, ensure_ascii=False))


