#!/bin/bash
output_file="output_index.csv"
output_file_time="output_time.csv"

# Clear the output file
> "$output_file"
> "$output_file_time"

start_time=$SECONDS
current_time=$((SECONDS - start_time))
curl -s 'localhost:9200/_cat/indices?v' | awk 'NR==1' | sed 's/ \+/,/g' >> "$output_file"
echo "time sec" >> "$output_file_time"

# Create an empty array
file_names=()

# Loop through files in the directory and add them to the array
for file in ./movie_data/*; do
    file_names+=("$file")
done

# Print the array
#printf '%s\n' "${file_names[@]}"

for ((i=0; i<${#file_names[@]}; i++)); do
    file="${file_names[$i]}"

    curl -s -X POST -H "Content-Type: application/json" -d @"$file" http://localhost:9200/routes/_doc > /dev/null 2>&1

    if (("$i" % 1000 == 0)); then
        curl -s 'localhost:9200/_cat/indices?v' | awk 'NR==2' | sed 's/ \+/,/g' >> "$output_file"
        current_time=$((SECONDS - start_time))
        echo "$current_time" >> "$output_file_time"
        echo "$file - $current_time sec"
    fi
done
