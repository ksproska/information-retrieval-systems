#!/bin/bash

output_file="output.csv"

# Clear the output file
> "$output_file"

echo "CPU %,MEM USAGE / LIMIT,MEM %,NET I/O" >> "$output_file"

while true; do
    # Run your command and append its output to the CSV file
    docker stats --all --no-stream --format "{{.CPUPerc}},{{.MemUsage}},{{.MemPerc}},{{.NetIO}}" elasticsearch >> "$output_file"

    # Wait for 0.5 seconds
    sleep 0.5
done
