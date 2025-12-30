<script setup>
import { HomeIcon, CubeIcon, UserIcon } from '@heroicons/vue/24/outline'
</script>

<template>
    <nav>
        <ul class="flex gap-4">
            <li>
                <RouterLink to="/dashboard" aria-label="Dashboard">
                    <HomeIcon class="w-6 h-6" />
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/produktlista" aria-label="Produktlista">
                    <CubeIcon class="w-6 h-6" />
                </RouterLink>
            </li>
            <li>
                <RouterLink to="/profil" aria-label="Profil">
                    <UserIcon class="w-6 h-6" />
                </RouterLink>
            </li>
        </ul>
    </nav>
</template>