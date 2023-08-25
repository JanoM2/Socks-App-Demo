let eventBus = new Vue();

Vue.component("product", {
  props: {
    premium: {
      type: Boolean,
      required: true,
    },
  },
  template: `
  <div class="product">

    <div class="product-image">
        <img :src="image">
    </div>

    <div class="product-info">
        <h1>{{title}}</h1>
        <p v-if="inStock">In Stock</p>
        <p v-else="inStock" :class="{crossOut: !inStock}">Out of Stock</p>
        <span v-if="onSale">{{printOnSale}}</span>
        <p>Shipping: {{ shipping }}</p>
        <!-- <a target="_blank" :href="link">Link</a> -->
        <p>{{printDescription}}</p>

        <div v-for="(variant, index) in variants" :key="variant.variantId" class="color-box"
            :style="{ backgroundColor: variant.variantColor }" @mouseover="updateProduct(index)">
        </div>

        <!-- <ul><li v-for="size in sizes">{{size.size}}</li></ul> -->

        <button @click="addToCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Add to Cart</button>
        <button @click="removeFromCart" :disabled="!inStock" :class="{disabledButton: !inStock}">Remove to Cart</button>

    </div>

    <product-tabs :reviews="reviews"></product-tabs>

</div>
`,
  data() {
    return {
      brand: "Vue Mastery",
      product: "Socks",
      description: "It's color is green",
      selectedVariant: 0,
      link: "https://www.vuemastery.com/images/challenges/vmSocks-green-onWhite.jpg",
      variants: [
        {
          variantId: 2234,
          variantColor: "green",
          variantImage: "/assets/vmSocks-green-onWhite.jpg",
          variantQuantity: 10,
        },
        {
          variantId: 2235,
          variantColor: "blue",
          variantImage: "/assets/vmSocks-blue-onWhite.jpg",
          variantQuantity: 10,
        },
      ],
      onSale: true,
      reviews: [],
      // sizes: [{ size: "S" }, { size: "M" }, { size: "L" }],
    };
  },
  methods: {
    addToCart() {
      this.$emit("add-to-cart", this.variants[this.selectedVariant].variantId);
    },
    removeFromCart() {
      this.$emit(
        "remove-from-cart",
        this.variants[this.selectedVariant].variantId
      );
    },
    updateProduct(index) {
      this.selectedVariant = index;
      console.log(index);
    },
  },
  computed: {
    title() {
      return this.brand + " " + this.product;
    },
    image() {
      return this.variants[this.selectedVariant].variantImage;
    },
    inStock() {
      return this.variants[this.selectedVariant].variantQuantity;
    },
    printOnSale() {
      return this.brand + " " + this.product;
    },
    shipping() {
      if (this.premium) {
        return "Free";
      }
      return 2.99;
    },
    printDescription() {
      return (
        "It's color is " + this.variants[this.selectedVariant].variantColor
      );
    },
  },
  mounted() {
    eventBus.$on("review-submitted", (productReview) => {
      this.reviews.push(productReview);
    });
  },
});

Vue.component("productdetails", {
  props: {
    details: {
      type: Boolean,
      required: true,
    },
  },
  template: `
  <ul class="details-list">
    <li v-if="details" v-for="info in information"> {{ info }} </li>
  </ul>`,
  data() {
    return {
      information: ["80% cotton", "20% polyester", "Gender-neutral"],
    };
  },
});

Vue.component("product-review", {
  props: {
    type: Boolean,
    required: true,
  },
  template: `
  <form class="review-form" @submit.prevent="onSubmit">

  <p v-if="errors.length">
    <b>Please correct the following error(s):</b>
      <ul>
        <li v-for="error in errors"> {{ error }} </li>
      </ul>
  </p>

    <p>
      <label for="name">Name:</label>
      <input id="name" v-model="name" placeholder="name" autocomplete="off">
    </p>

    <p>
      <label for="review">Review:</label>      
      <textarea id="review" v-model="review"></textarea>
    </p>

    <p>
      <label for="rating">Rating:</label>
      <select id="rating" v-model.number="rating">
        <option>5</option>
        <option>4</option>
        <option>3</option>
        <option>2</option>
        <option>1</option>
      </select>
    </p>

    <p>
      <label>Would you recommend this product?</label>
      
      <label for="yes"><b>Yes</b></label>
      <input type="radio" v-model="recommend" id="yes" name="recommendation" value="yes">
      <label for="no"><b>No</b></label>
      <input type="radio" v-model="recommend" id="no" name="recommendation" value="no">
    </p>

    <p>
      <input type="submit" value="Submit">  
    </p>    

  </form>
  `,
  data() {
    return {
      name: null,
      review: null,
      rating: null,
      recommend: null,
      errors: [],
    };
  },
  methods: {
    onSubmit() {
      if (this.name && this.review && this.rating) {
        let productReview = {
          name: this.name,
          review: this.review,
          rating: this.rating,
          recommend: this.recommend,
        };

        console.log(productReview);

        eventBus.$emit("review-submitted", productReview);
        this.name = null;
        this.review = null;
        this.rating = null;
        this.recommend = null;
      } else {
        if (!this.name) this.errors.push("Name Required");
        if (!this.review) this.errors.push("Review Required");
        if (!this.rating) this.errors.push("Rating Required");
      }
    },
  },
});

Vue.component("product-tabs", {
  props: {
    reviews: {
      type: Array,
      required: true,
    },
  },
  template: `
  <div>
  <span :class="{activeTab: selectedTab === tab}" class="tab" v-for="(tab, index) in tabs" :key="index"
      @click="selectedTab = tab">
      {{ tab }}</span>

  <div v-show="selectedTab === 'Reviews'" class="div-produc-tabs">
      <h2>Reviews</h2>
      <p v-if="!reviews.length">There are no reviews yet.</p>
      <ul>
          <li v-for="review in reviews">
              <p><b>Name:</b> {{ review.name }}</p>
              <p><b>Rating:</b> {{ review.rating }}</p>
              <p class="p-review"><b>Review:</b> {{ review.review }}</p>
              <p><b>Recommend:</b> {{ review.recommend }}</p>
          </li>
      </ul>
  </div>

  <product-review v-show="selectedTab === 'Make a review'"></product-review>
</div>
  `,
  data() {
    return {
      tabs: ["Reviews", "Make a review"],
      selectedTab: "Reviews",
    };
  },
});

let app = new Vue({
  el: "#app",
  data: {
    premium: true,
    cart: [],
    details: true,
  },
  methods: {
    updateCart(id) {
      this.cart.push(id);
    },
    removeItem(id) {
      for (let i = this.cart.length - 1; i >= 0; i--) {
        if (this.cart[i] === id) {
          return this.cart.splice(i, 1);
        }
      }
    },
  },
});
