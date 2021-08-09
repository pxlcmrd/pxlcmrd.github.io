OUTPUT_JS=js/all.min.js
EXTERNS=js/externs.js
SOURCES_JS=js/list.min.js js/main.js

gera_min: $(EXTERNS) $(SOURCES_JS) $(OUTPUT_JS)
	@ echo 'Fim!'

$(OUTPUT_JS): $(EXTERNS) $(SOURCES_JS)
	java -jar closure-compiler-v20210601.jar --compilation_level ADVANCED_OPTIMIZATIONS --externs $(EXTERNS) --js $(SOURCES_JS) --js_output_file $@
