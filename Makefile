OUTPUT_JS=assets/js/all.min.js
EXTERNS=assets/js/externs.js
SOURCES_JS=assets/js/list.min.js assets/js/arrFunk.js assets/js/arrNovelas.js assets/js/arrTrilhas.js assets/js/ordena.js assets/js/templateBuilder.js assets/js/app.js
SOURCE_INDEX=index_dev.html
INDEX=index.html

gera_min: $(EXTERNS) $(SOURCES_JS) $(SOURCE_INDEX) $(OUTPUT_JS) $(INDEX)
	@ echo 'Fim!'

$(OUTPUT_JS): $(EXTERNS) $(SOURCES_JS)
	java -jar closure-compiler-v20230502.jar --compilation_level SIMPLE_OPTIMIZATIONS --externs $(EXTERNS) --js $(SOURCES_JS) --js_output_file $@

$(INDEX): $(SOURCE_INDEX)
	sed -e "/<!-- REMOVE_JS_BEGIN -->/,/<!-- REMOVE_JS_END -->/c\        <script src=\"./${OUTPUT_JS}\"></script>" $(SOURCE_INDEX) > $(INDEX)
