import sys

with open('src/components/thynk13/PlanetField.tsx', 'r') as f:
    lines = f.readlines()

def fix_line(i, old, new):
    if old in lines[i]:
        lines[i] = lines[i].replace(old, new)
    else:
        print(f"Warning: could not find '{old}' in line {i+1}")

# Fix lookAt
fix_line(124, "let zx = e[0] - t[0], zy = e[1] - t[1], zz = e[2] - t[2];", 
         "  const e0 = e[0]!, e1 = e[1]!, e2 = e[2]!;\n  const t0 = t[0]!, t1 = t[1]!, t2 = t[2]!;\n  let zx = e0 - t0, zy = e1 - t1, zz = e2 - t2;")
fix_line(135, "-(xx * e[0] + xy * e[1] + xz * e[2]), -(yx * e[0] + yy * e[1] + yz * e[2]), -(zx * e[0] + zy * e[1] + zz * e[2]), 1,",
         "    -(xx * e0 + xy * e1 + xz * e2), -(yx * e0 + yy * e1 + yz * e2), -(zx * e0 + zy * e1 + zz * e2), 1,")

# Fix frame cursor calculation
fix_line(293, "const dx = view[0] * vx + view[1] * vy - view[2];", "const dx = view[0]! * vx + view[1]! * vy - view[2]!;")
fix_line(294, "const dy = view[4] * vx + view[5] * vy - view[6];", "const dy = view[4]! * vx + view[5]! * vy - view[6]!;")
fix_line(295, "const dz = view[8] * vx + view[9] * vy - view[10];", "const dz = view[8]! * vx + view[9]! * vy - view[10]!;")
fix_line(297, "const s = (-1.3 - eye[1]) / dy;", "const s = (-1.3 - eye[1]!) / dy;")
fix_line(298, "cursor[0] = lerp(cursor[0], eye[0] + dx * s, 0.15);", "cursor[0] = lerp(cursor[0]!, eye[0]! + dx * s, 0.15);")
fix_line(299, "cursor[2] = lerp(cursor[2], eye[2] + dz * s, 0.15);", "cursor[2] = lerp(cursor[2]!, eye[2]! + dz * s, 0.15);")

# Fix uniforms in fieldP
fix_line(308, "gl.uniformMatrix4fv(fu.uProj, false, proj);", "gl.uniformMatrix4fv(fu['uProj'] ?? null, false, proj);")
fix_line(309, "gl.uniformMatrix4fv(fu.uView, false, view);", "gl.uniformMatrix4fv(fu['uView'] ?? null, false, view);")
fix_line(310, "gl.uniform1f(fu.uTime, tsec);", "gl.uniform1f(fu['uTime'] ?? null, tsec);")
fix_line(311, "gl.uniform1f(fu.uWave, wave);", "gl.uniform1f(fu['uWave'] ?? null, wave);")
fix_line(312, "gl.uniform1f(fu.uCalm, calm);", "gl.uniform1f(fu['uCalm'] ?? null, calm);")
fix_line(313, "gl.uniform1f(fu.uStream, stream);", "gl.uniform1f(fu['uStream'] ?? null, stream);")
fix_line(314, "gl.uniform1f(fu.uActivity, activity);", "gl.uniform1f(fu['uActivity'] ?? null, activity);")
fix_line(315, "gl.uniform1f(fu.uAppear, appear);", "gl.uniform1f(fu['uAppear'] ?? null, appear);")
fix_line(316, "gl.uniform1f(fu.uCurve, curve);", "gl.uniform1f(fu['uCurve'] ?? null, curve);")
fix_line(317, "gl.uniform1f(fu.uPx, 1.6 * DPR);", "gl.uniform1f(fu['uPx'] ?? null, 1.6 * DPR);")
fix_line(318, "gl.uniform1f(fu.uFade, fade);", "gl.uniform1f(fu['uFade'] ?? null, fade);")
fix_line(319, "gl.uniform3f(fu.uCursor, cursor[0], cursor[1], cursor[2]);", "gl.uniform3f(fu['uCursor'] ?? null, cursor[0]!, cursor[1]!, cursor[2]!);")

# Fix uniforms in dustP
fix_line(333, "gl.uniformMatrix4fv(du.uProj, false, proj);", "gl.uniformMatrix4fv(du['uProj'] ?? null, false, proj);")
fix_line(334, "gl.uniformMatrix4fv(du.uView, false, view);", "gl.uniformMatrix4fv(du['uView'] ?? null, false, view);")
fix_line(335, "gl.uniform1f(du.uTime, tsec);", "gl.uniform1f(du['uTime'] ?? null, tsec);")
fix_line(336, "gl.uniform1f(du.uFly, fly);", "gl.uniform1f(du['uFly'] ?? null, fly);")
fix_line(337, "gl.uniform1f(du.uPx, 1.6 * DPR);", "gl.uniform1f(du['uPx'] ?? null, 1.6 * DPR);")
fix_line(338, "gl.uniform1f(du.uFade, fade);", "gl.uniform1f(du['uFade'] ?? null, fade);")
fix_line(339, "gl.uniform3f(du.uCam, eye[0], eye[1], eye[2]);", "gl.uniform3f(du['uCam'] ?? null, eye[0]!, eye[1]!, eye[2]!);")

with open('src/components/thynk13/PlanetField.tsx', 'w') as f:
    f.writelines(lines)
