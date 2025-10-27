
from ortools.sat.python import cp_model
import json


SLOTS_PER_DAY = 5  # 17,18,19,20,21
DAYS = ["Lun", "Mar", "Mie", "Jue", "Vie"]
SLOTS = [f"{d}{17+i}" for d in DAYS for i in range(SLOTS_PER_DAY)]  # 25 slots
slot2day = {s: (s[:3], int(s[3:]) - 17) for s in SLOTS}

ROOMS = ["Aula 12 edificio k", "Aula 11 edificio k","Aula 13 edificio k", "Aula 11 edificio I", "Aula 10 edificio j", "Aula 12 edificio j", "SUMPA edificio k"]
PROFS = ["Jesus Hernan", "Manuel", "Emmanuel", "Brandon","Angelica","Maria Guadalupe","Profe Ingles1","Profe Ingles2","Profe Ingles3","Profe Ingles4"]
GROUPS = [
    {"id": "IDGS14", "grade": "7mo"},
    {"id": "IDGS15", "grade": "7mo"},
    {"id": "IDGS16", "grade": "7mo"},
    {"id": "IDGS17", "grade": "7mo"},
]

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
    patterns = []
    rem = H
    pat = []
    while rem >= 2:
        pat.append(2)
        rem -= 2
    if rem == 1:
        pat.append(1)
    patterns.append(("greedy", pat))
    if allow_spread and H <= 5:
        patterns.append(("spread", [1]*H))
    return patterns

# Build patterns and units
units = []
patterns_by_subj = {}
unit_counter = 0
for g in SUBJECTS:
    for subj in SUBJECTS[g]:
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
ROOM_INDEX = {r: i for i, r in enumerate(ROOMS)}
PROF_INDEX = {p: i for i, p in enumerate(PROFS)}
GROUP_INDEX = {g["id"]: i for i, g in enumerate(GROUPS)}
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
for g in GROUPS:
    g_id = g["id"]
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
    print("Asignaciones:")
    print(json.dumps(assignments, indent=2, ensure_ascii=False))
    with open('resultado.json', 'w', encoding='utf-8') as f:
        json.dump(assignments, f, ensure_ascii=False, indent=4)
    chosen_patterns = []
    for (g, subj), pat_list in patterns_by_subj.items():
        for pat in pat_list:
            zvar = z_vars[(g, subj, pat["pat_key"])]
            if solver.Value(zvar) == 1:
                chosen_patterns.append({"group": g, "subj": subj, "chosen": pat["pat_key"], "type": pat["pat_type"]})
    print("Patrones elegidos:")
    print(json.dumps(chosen_patterns, indent=2, ensure_ascii=False))
else:
    print("No se encontró solución factible en el tiempo límite. Estado:", solver.StatusName(result))
