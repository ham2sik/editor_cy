```html
<script type="text/javascript" src="http://its.jobkorea.kr/content/js/lazyUIT.min.js"></script>
<script>
	$(window).load(function() {
		// lazyUIT.youTube(element);
		lazyUIT.youTube();
	});
</script>

<!-- 입력 소스 -->
<div class="lazyYoutube" data-src="https://www.youtube.com/embed/3W5ACF-guFc" data-options='{"title":"잡코리아 2017년 신입공채", "width":"560", "height":"315"}'></div>

<!-- lazy 실행 후 변환된 소스 -->
<div class="lazyYoutube"><iframe width="560" height="315" title="잡코리아 2017년 신입공채" src="https://www.youtube.com/embed/3W5ACF-guFc" frameborder="0" allowfullscreen></iframe></div>
```
