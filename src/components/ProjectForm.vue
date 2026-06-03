<script setup>
import { ref } from 'vue'

</script>

<template>
    <form>
        <label for="name">Project Name</label>
        <input id="name">
        
        <label for="owner">Owner</label>
        <input id="owner">

        <label for="date">Due Date</label>
        <input id="date" type="date">

        <label for="status">Status</label>
        <select id="status">
            <option>Not Started</option>
            <option>In Progress</option>
            <option>Completed</option>
        </select>

        <label for="description">Description</label>
        <textarea id="description"></textarea>

        <input class="button" type="submit" value="Submit">
    </form>
</template> <!--Is the ID mandatory in the form-->