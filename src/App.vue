<script setup lang="ts">
  import SearchBoxInput from './components/inputs/SearchBoxInput.vue'
  import AddressInput from './components/inputs/AddressInput.vue'
  import CepInput from './components/inputs/CepInput.vue'
  import CpfCnpjInput from './components/inputs/CpfCnpjInput.vue'
  import EmailInput from './components/inputs/EmailInput.vue'
  import PasswordInput from './components/inputs/PasswordInput.vue'
  import PhoneNumberInput from './components/inputs/PhoneNumberInput.vue'
  import StateInput from './components/inputs/StateInput.vue'
  import CityInput from './components/inputs/CityInput.vue'
  import NumberAddressInput from './components/inputs/NumberAddressInput.vue'
  import NameInput from './components/inputs/NameInput.vue'
</script>

<template>
  <div class="w-1/2 m-auto mt-16">
    <SearchBoxInput />
    <AddressInput required />
    <CepInput required />
    <CpfCnpjInput required />
    <EmailInput required />
    <PasswordInput required />
    <PhoneNumberInput required />
    <StateInput required />
    <CityInput required />
    <NumberAddressInput required />
    <NameInput required />
  </div>
</template>
