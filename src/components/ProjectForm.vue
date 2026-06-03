<script setup>
import { ref } from 'vue'

</script>

<template>
    <div class="page-wrapper">
        <div class="project-form-container">
            <h1>New Project</h1>
            <form class="project-form">
                <label for="name">Project Name<span style="color: black;">&#8277;</span></label>
                <input id="name" placeholder="Project XYZ" required>
                
                <label for="owner">Owner<span style="color: black;">&#8277;</span></label>
                <input id="owner" placeholder="John Doe" required>

                <label for="date">Due Date<span style="color: black;">&#8277;</span></label>
                <input id="date" type="date" required>

                <label for="status">Status<span style="color: black;">&#8277;</span></label>
                <select id="status" required>
                    <option> </option>
                    <option>Not Started</option>
                    <option>In Progress</option>
                    <option>Completed</option>
                </select>

                <label for="description">Description<span style="color: black;">&#8277;</span></label>
                <textarea id="description" placeholder="Enter project overview" rows="5" required></textarea>

                <div class="button-wrapper">
                    <input class="button" type="submit" value="Add Project">
                </div>
            </form>
        </div>
    </div>
</template> <!--Is the ID mandatory in the form?-->

<style>
template {
    margin: 0px;
}
.page-wrapper {
    display: flex;
    justify-content: center;
    align-content: center;
}
.project-form-container {
    padding: 30px;
    margin: 50px;
    width: 40%;
    height: auto;
    border-radius: 12px;
    box-shadow: 3px 3px 4px 3px rgba(0,0,0,0.25);
}

h1 {
    margin: 10px 50px 30px;
}

label{
    display: block;
    margin: 0px 50px;
    font-weight: bold;
    font-size: large;
}

input, select, textarea{
    display: block;
    margin: 10px 50px 20px;
    border: 1px solid rgba(68, 67, 67, 0.274);
    border-radius: 8px;
    padding: 7px;
    font-family: serif, Arial, Helvetica;
    font-size: medium;
}

#name, #owner, #description{
    width: 80%;
}

#date, #status {
    width:15%
}

input::placeholder, select::placeholder, textarea::placeholder {
    color: rgba(0,0,0,1s);
    opacity: 0.8;
    font-family: serif, Arial, Helvetica;
    font-size: medium;
}

.button-wrapper {
    display: flex;
    justify-content: center;
    margin-top: 30px;
}

.button{
    font-weight: bold;
    font-size: medium;
    background-color: white;
    width: fit-content;
    padding: 10px ;
    border: none;
    background-color: #233CCA;
    color: white;
}
.button:hover {
    transition: transform 0.3s ease, box-shadow 0.3s ease;
    transform: translateY(-8px) scale(1.03);
}
</style>