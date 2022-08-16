<template>
  <div class="columns">
    <div id="map" class="column">
      <div id="rover" :style="`width: ${pixelScale/100 * 40}px; height: ${pixelScale/100 * 45}px; transform: translate(${roverX}px, ${roverY}px) rotate(${roverYaw}deg)`">
        <div id="mast" :style="`left: ${(pixelScale / 100 * 45 / 2)-2.5}px`"></div>
      </div>
    </div>
    <div id="control" class="column">
      <div class="section">
        <div class="field">
          <label class="label">Scale: Pixels to 1m</label>
          <div class="control">
            <input class="input" type="number" v-model="pixelScale">
          </div>
        </div>
        <div class="field">
          <label class="label">Position X</label>
          <div class="control">
            <input class="input" type="number" v-model="roverX">
          </div>
        </div>
        <div class="field">
          <label class="label">Position Y</label>
          <div class="control">
            <input class="input" type="number" v-model="roverY">
          </div>
        </div>
        <div class="field">
          <label class="label">Rotation</label>
          <div class="control">
            <input class="input" type="number" v-model="roverYaw">
          </div>
        </div>
        
        <div class="divider" />

        <div class="field">
          <label class="label">Manoeuvre</label>

          <div class="select">
            <select v-model="manoeuvre">
              <option value="move">Move</option>
              <option value="rotate">Rotate</option>
            </select>
          </div>
        </div>

        <div class="field">
          <label class="label">Amount</label>
          <div class="control">
            <input class="input" type="number" v-model="mValue">
          </div>
        </div>

        <button class="button" @click="perform">Submit</button>
      </div>
      <pre>{{ traverse }}</pre>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      roverX: 40,
      roverY: 690,
      roverYaw: 45,
      pixelScale: 100,
      manoeuvre: 'rotate',
      mValue: 0,
      traverse: []
    };
  },
  watch: {
    roverYaw() {
      this.roverYaw = this.roverYaw % 360
      if (this.roverYaw < 0) {
        this.roverYaw = 360 + this.roverYaw
      }
    }
  },
  methods: {
    perform() {
      this.traverse.push({
        [this.manoeuvre]: this.mValue
      })
      if (this.manoeuvre === 'rotate') {
        this.roverYaw += this.mValue
      }
      else {
        const scale = this.pixelScale / 100
        if (this.roverYaw === 0) {
          const y = this.mValue * scale
          this.roverY -= y
        }
        else if (this.roverYaw < 90) {
          const rads = 2 * Math.PI * (this.roverYaw / 360)

          const x = this.mValue / Math.cos(rads)
          const y = this.mValue / Math.sin(rads)          
          this.roverX += x * scale
          this.roverY -= y * scale
        }
        else if (this.roverYaw === 90) {
          const x = this.mValue 
          this.roverX += x * scale
        }
        else if (this.roverYaw < 180) {
          const rads = 2 * Math.PI * ((this.roverYaw -90) / 360)

          const x = this.mValue / Math.sin(rads) * scale
          const y = this.mValue / Math.cos(rads) * scale          
          this.roverX += x 
          this.roverY += y 
        }
        else if (this.roverYaw === 180) {
          const y = this.mValue * scale
          this.roverY += y 
        }
        else if (this.roverYaw < 270) {
          const rads = 2 * Math.PI * ((this.roverYaw -180) / 360)

          const x = this.mValue / Math.cos(rads) * scale
          const y = this.mValue / Math.sin(rads) * scale      
          this.roverX -= x
          this.roverY += y
        }
        else if (this.roverYaw === 270) {
          const x = this.mValue * scale
          this.roverX -= x
        }
        else if (this.roverYaw < 360) {
          const rads = 2 * Math.PI * ((this.roverYaw -270) / 360)

          const x = this.mValue / Math.sin(rads)
          const y = this.mValue / Math.cos(rads)       
          this.roverX -= x * scale
          this.roverY -= y * scale
        }
      }
      this.mValue = 0
    }
  }
}
</script>

<style>
#map {
  background-image: url('/static/Chryse_orbital_image.png');
  background-repeat: no-repeat;
  background-size: contain;
  height: 800px;
}
#rover {
  background-color: #f0f;
  position: absolute;
  transition: all 1s ease-in-out;
}
#mast {
  height: 5px;
  width: 5px;
  background-color: #000;
  position: relative;
}
.divider {
  width: 100%;
  height: 1px;
  margin: 25px 0;
  background-color: #ccc;
}
</style>
