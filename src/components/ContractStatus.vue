<template>
    <div class="text-[12px]">
        <span v-if="type === 'closed'" class="bg-red-600 tag">
            closed
        </span>
        <span v-if="type === 'open'" class="tag bg-blue-500">
            open
        </span>
        <span v-if="type === 'paused'" class="tag bg-orange-400">
            Paused
        </span>
        <span v-if="type === 'completed'" class="tag bg-green-500">
            Completed
        </span>
    </div>
</template>
<script>
export default {
    name: "ContractStatus",
    props: {
        type: String,
    }
}
</script>
<style>
    .tag{
        @apply px-4 py-1 text-white rounded-full
    }
</style>