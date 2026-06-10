# GLB Model Optimization Workflow
## Target: Reduce 27MB model to 5-10MB

## Current Analysis
- `base_basic_pbr.glb`: 18.4MB (needs optimization)
- `base_basic_shaded.glb`: 9.9MB (already near target)

---

## Phase 1: Blender Optimization (Pre-Export)

### Step 1: Import and Analyze Model
1. Open Blender
2. File > Import > glTF 2.0 (.glb/.gltf)
3. Select `base_basic_pbr.glb`

### Step 2: Remove Unused Elements
**Remove Unused Meshes:**
- Select all objects (A)
- Right-click > Select All by Type > Mesh
- Check Outliner for hidden/unused meshes
- Delete any unnecessary meshes

**Remove Unused Materials:**
- Go to Materials tab
- Check each material's usage count
- Delete materials with 0 users

**Remove Unused Animations:**
- Open Dope Sheet (Shift+F12)
- Check for unused action strips
- Delete unused actions

**Remove Unused Vertices:**
- Select mesh > Edit Mode
- Mesh > Clean Up > Delete Loose
- Mesh > Clean Up > Merge By Distance (set to 0.0001)

### Step 3: Polygon Reduction (Decimation)
**Conservative Decimation (Preserve Quality):**
1. Select mesh > Object Mode
2. Add Modifier > Decimate
3. Settings:
   - Ratio: 0.6 (reduce to 60% of original)
   - Face Count: Check target face count
4. Apply modifier

**Aggressive Decimation (If needed):**
- Ratio: 0.4 (reduce to 40%)
- Only apply to non-critical parts (background elements)

### Step 4: Texture Optimization
**Reduce Texture Resolution:**
1. Open Shader Editor
2. For each texture node:
   - Note current resolution (e.g., 4096x4096)
   - Reduce to 2048x2048 or 1024x1024
   - Use Image > Resize

**Convert to Efficient Formats:**
- Export textures as PNG (lossless)
- Or use JPEG for non-alpha textures (quality 85%)

**Remove Duplicate Textures:**
- Use Image > Find Duplicate Images
- Merge identical textures

### Step 5: Export Settings
**Export as glTF 2.0:**
1. File > Export > glTF 2.0 (.glb/.gltf)
2. **Exact Settings:**
   ```
   Format: glTF Binary (.glb)
   Include:
   ✓ Selected Objects
   ✓ Custom Properties
   ✓ Materials
   ✓ Mesh
   ✓ Geometry
   ✓ Shape Keys
   ✓ Skinning
   ✓ Animations
   ✓ Apply Modifiers
   ✓ Tangents
   ✓ Vertex Colors
   
   Mesh:
   - Apply Modifiers: ✓
   - Tangents: ✓
   - Vertex Colors: ✓
   
   Geometry:
   - Compression Mode: None (we'll compress later)
   
   Animation:
   - Sampling Rate: 24fps (reduce from 60fps if applicable)
   - Always Sample Animations: ✓
   
   Transform:
   - Forward: -Z Forward
   - Up: Y Up
   ```

---

## Phase 2: glTF-Transform Optimization

### Install glTF-Transform
```bash
npm install -g @gltf-transform/cli
```

### Step 1: Analyze Model
```bash
gltf-transform inspect base_basic_pbr.glb
```

### Step 2: Remove Unused Data
```bash
gltf-transform dedup base_basic_pbr.glb base_basic_pbr_step1.glb
```
**What this does:**
- Removes duplicate vertices
- Removes duplicate accessors
- Removes duplicate materials

### Step 3: Texture Compression (WebP)
```bash
gltf-transform texture-compress \
  base_basic_pbr_step1.glb \
  base_basic_pbr_step2.glb \
  --format webp \
  --quality 85 \
  --encoder srgb
```
**What this does:**
- Converts textures to WebP format
- Quality 85 balances size and visual quality
- sRGB encoder for proper color space

### Step 4: Draco Compression
```bash
gltf-transform draco \
  base_basic_pbr_step2.glb \
  base_basic_pbr_step3.glb \
  --method edgebreaker \
  --encode-speed 5 \
  --decode-speed 5 \
  --compression-level 7
```
**What this does:**
- Applies Draco geometry compression
- Edgebreaker method for better compression ratio
- Compression level 7 (0-10, higher = smaller but slower)
- Balanced encode/decode speed (5)

### Step 5: Mesh Simplification (If needed)
```bash
gltf-transform simplify \
  base_basic_pbr_step3.glb \
  base_basic_pbr_final.glb \
  --ratio 0.6 \
  --error 0.0001
```
**What this does:**
- Reduces polygon count by 40%
- Error threshold 0.0001 preserves visual quality
- Only use if still above 10MB after other steps

### Step 6: Final Optimization
```bash
gltf-transform prune \
  base_basic_pbr_final.glb \
  base_basic_pbr_final_opt.glb
```
**What this does:**
- Removes unused nodes, materials, textures
- Removes empty accessors
- Cleans up the file structure

---

## Phase 3: Alternative: One-Command Optimization

### Complete Optimization Pipeline
```bash
gltf-transform \
  dedup \
  texture-compress --format webp --quality 85 --encoder srgb \
  draco --method edgebreaker --compression-level 7 \
  prune \
  base_basic_pbr.glb \
  base_basic_pbr_optimized.glb
```

---

## Expected Size Reduction

### Conservative Approach (Preserve Quality):
- Remove unused data: -10-15%
- Texture compression (WebP 85%): -30-40%
- Draco compression: -20-30%
- **Total reduction: ~60-70%**
- **Expected final size: 5.5-7.4MB**

### Aggressive Approach (If needed):
- Add mesh simplification (60% ratio): -25-35%
- **Total reduction: ~75-85%**
- **Expected final size: 2.7-4.6MB**

---

## Verification Steps

### 1. Check File Size
```bash
ls -lh base_basic_pbr_optimized.glb
```

### 2. Verify Model Integrity
```bash
gltf-transform inspect base_basic_pbr_optimized.glb
```

### 3. Test in Browser
- Load optimized model in your application
- Check for visual artifacts
- Verify animations work correctly
- Test on mobile devices

### 4. Compare Quality
- Open original and optimized models side-by-side
- Check texture quality
- Verify geometry looks correct
- Ensure no missing materials

---

## Troubleshooting

### Model Too Large After Optimization
1. Increase texture compression quality to 75%
2. Add mesh simplification with ratio 0.5
3. Reduce texture resolution in Blender first

### Visual Quality Degraded
1. Reduce Draco compression level to 5
2. Increase texture quality to 90%
3. Use mesh simplification ratio 0.7 instead of 0.6

### Missing Textures
1. Check if textures were converted properly
2. Verify texture paths in glTF-Transform output
3. Re-export from Blender with correct settings

### Animation Issues
1. Ensure animation sampling rate is adequate (24fps minimum)
2. Check if Draco compression affected animation
3. Try without Draco compression for animation-heavy models

---

## Quick Reference Commands

### Full Optimization (Recommended)
```bash
gltf-transform dedup \
  base_basic_pbr.glb base_basic_pbr_temp.glb && \
gltf-transform texture-compress \
  --format webp --quality 85 --encoder srgb \
  base_basic_pbr_temp.glb base_basic_pbr_temp2.glb && \
gltf-transform draco \
  --method edgebreaker --compression-level 7 \
  base_basic_pbr_temp2.glb base_basic_pbr_final.glb && \
gltf-transform prune \
  base_basic_pbr_final.glb base_basic_pbr_optimized.glb && \
rm base_basic_pbr_temp.glb base_basic_pbr_temp2.glb base_basic_pbr_final.glb
```

### Texture-Only Optimization (Preserve Geometry)
```bash
gltf-transform texture-compress \
  --format webp --quality 85 --encoder srgb \
  base_basic_pbr.glb base_basic_pbr_optimized.glb
```

### Geometry-Only Optimization (Preserve Textures)
```bash
gltf-transform draco \
  --method edgebreaker --compression-level 7 \
  base_basic_pbr.glb base_basic_pbr_optimized.glb
```

---

## Notes

- Always keep original file as backup
- Test each step incrementally
- Document which settings work best for your specific model
- Consider using the shaded version (9.9MB) if PBR version proves difficult to optimize
- For web use, Draco compression is highly recommended
- WebP textures provide excellent compression with minimal quality loss
