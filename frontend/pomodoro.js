
        // Default Pomodoro configuration
        let pomodoroConfig = {
            workTime: 25, // Work time in minutes
            breakTime: 5, // Break time in minutes
            cycles: 5,    // Number of work-break cycles
        };

        // Load existing configuration from localStorage on page load
        document.addEventListener('DOMContentLoaded', () => {
            const savedConfig = localStorage.getItem('pomodoroConfig');
            if (savedConfig) {
                pomodoroConfig = JSON.parse(savedConfig);
                console.log('Loaded Pomodoro Config from localStorage:', pomodoroConfig);

                // Populate the form fields with the saved values
                document.getElementById('workTimeInput').value = pomodoroConfig.workTime;
                document.getElementById('breakTimeInput').value = pomodoroConfig.breakTime;
                document.getElementById('cyclesInput').value = pomodoroConfig.cycles;
            } else {
                console.log('No saved Pomodoro Config found. Using defaults.');
            }
        });

        // Save configuration
        document.getElementById('pomodoroConfigForm').addEventListener('submit', (event) => {
            event.preventDefault();

            // Get values from the form inputs
            pomodoroConfig.workTime = parseInt(document.getElementById('workTimeInput').value, 10);
            pomodoroConfig.breakTime = parseInt(document.getElementById('breakTimeInput').value, 10);
            pomodoroConfig.cycles = parseInt(document.getElementById('cyclesInput').value, 10);

            // Save to localStorage
            localStorage.setItem('pomodoroConfig', JSON.stringify(pomodoroConfig));
            console.log('Saved Pomodoro Config to localStorage:', pomodoroConfig);

            alert('Pomodoro settings saved successfully!');
        });

        // Reset configuration to defaults
        document.getElementById('resetPomodoroConfig').addEventListener('click', () => {
            localStorage.removeItem('pomodoroConfig'); // Remove saved config
            pomodoroConfig = {
                workTime: 25,
                breakTime: 5,
                cycles: 5,
            }; // Reset to defaults

            // Reset form fields
            document.getElementById('workTimeInput').value = pomodoroConfig.workTime;
            document.getElementById('breakTimeInput').value = pomodoroConfig.breakTime;
            document.getElementById('cyclesInput').value = pomodoroConfig.cycles;

            console.log('Pomodoro Config reset to default:', pomodoroConfig);
            alert('Pomodoro settings have been reset to default.');
        });
