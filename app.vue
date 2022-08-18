<template>
  <div class="columns">
    <div id="map" class="column">
      <div id="rover" :style="`transition: all ${speed/1000}s ease-in-out; width: ${pixelScale/100 * 40}px; height: ${pixelScale/100 * 45}px; transform: translate(${roverX}px, ${roverY}px) rotate(${roverYaw}deg)`">
        <div id="mast" :style="`left: ${(pixelScale / 100 * 40 / 2) - 2.5}px`"></div>
        <div :class="{ 'is-hidden': !goFast }" class="go-faster-stripe" :style="`height: ${pixelScale/100*45}px; left: ${(pixelScale / 100 * 40 / 2) - 10}px`"></div>
        <div :class="{ 'is-hidden': !goFast }" class="go-faster-stripe" :style="`height: ${pixelScale/100*45}px; left: ${(pixelScale / 100 * 40 / 2) + 8}px`"></div>
        <div v-if="angles" class="thingy-line" v-for="line of lines" :key="line" :style="`left: ${(pixelScale / 100 * 40 / 2)}px; transform: rotate(${line}deg)`" />
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
          <label class="label">X Position (pixels)</label>
          <div class="control">
            <input class="input" type="number" v-model="roverX">
          </div>
        </div>
        <div class="field">
          <label class="label">Y Position (pixels)</label>
          <div class="control">
            <input class="input" type="number" v-model="roverY">
          </div>
        </div>
        <div class="field">
          <label class="label">Rotation (degrees)</label>
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
          <label class="label">Amount ({{ manoeuvre === 'rotate' ? 'Degrees' : 'cm'}})</label>
          <div class="control">
            <input class="input" type="number" v-model="mValue">
          </div>
        </div>

        <div class="buttons">
          <div class="field">
            <button class="button" @click="perform">Submit</button>
            <button class="button is-primary" @click="retrace">Retrace Our Steps</button>
          </div>
        </div>
        <div class="field">
          <label class="checkbox">
            <input type="checkbox" v-model="goFast">
            Go Fast
          </label>
        </div>
        <div class="field">
          <label class="checkbox">
            <input type="checkbox" v-model="angles">
            Angles
          </label>
        </div>
      </div>
      <pre>{{ traverse }}</pre>
    </div>
  </div>
</template>

<script>
function delay(time) {
  return new Promise(resolve => setTimeout(resolve, time));
}

export default {
  data() {
    return {
      roverX: parseInt(this.$route.query.x )|| 50,
      roverY: parseInt(this.$route.query.y) || 790,
      roverYaw: parseInt(this.$route.query.r) || 45,
      pixelScale: parseInt(this.$route.query.s) || 100,
      manoeuvre: 'rotate',
      angles: false,
      mValue: 0,
      traverse: [],
      goFast: false,
      whatWeDid: [
        {
          type: 'rotate',
          value: 15,
        },
        {
          type: 'move',
          value: 50,
        },
        {
          type: 'move',
          value: -50,
        },
        {
          type: 'rotate',
          value: 30,
        },
        {
          type: 'move',
          value: 125,
        },
        {
          type: 'rotate',
          value: -90,
        },
        {
          type: 'move',
          value: 125,
        },
        {
          type: 'rotate',
          value: 64,
        },
        {
          type: 'move',
          value: 112,
        },
        {
          type: 'rotate',
          value: -50,
        },
        {
          type: 'move',
          value: 55,
        },
        {
          type: 'move',
          value: -50,
        },
        {
          type: 'rotate',
          value: -23,
        },
        {
          type: 'move',
          value: 181,
        },
        {
          type: 'rotate',
          value: -64,
        },
        {
          type: 'move',
          value: 150,
        },
        {
          type: 'rotate',
          value: 50,
        },
        {
          type: 'move',
          value: 75,
        },
      ],
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
  computed: {
    speed() {
      return this.goFast ? 100 : 1000
    }
  },
  methods: {
    async retrace() {
      for (const step of this.whatWeDid) {
        this.manoeuvre = step.type
        this.mValue = step.value
        this.perform()
        await delay(this.speed)
      }
    },
    perform() {
      this.traverse.push({
        [this.manoeuvre]: this.mValue
      })
      if (this.manoeuvre === 'rotate') {
        this.roverYaw += this.mValue
      }
      else {
        const scale = this.pixelScale / 100

        const rads = 2 * Math.PI * (this.roverYaw / 360)

        const x = this.mValue * Math.sin(rads) * scale
        const y = this.mValue * Math.cos(rads) * scale
        this.roverX += x
        this.roverY -= y
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
  height: 909px;
}
#rover {
  background-color: #f0f;
  position: absolute;
}
#mast {
  height: 5px;
  width: 5px;
  background-color: #000;
  position: relative;
}
.go-faster-stripe {
  top: 0px;
  width: 2px;
  background-color: #0f0;
  position: absolute;
}
.divider {
  width: 100%;
  height: 1px;
  margin: 25px 0;
  background-color: #ccc;
}
.thingy-line {
  width: 2px;
  height: 500px;
  top: -250px;
  position: absolute;
  background-color: #000;
}
.circle {
  border-radius:50%;
  border: solid thin #0ff;
  position: absolute;
}
</style>
