```html
<body>

<script type="text/javascript" src="http://its.jobkorea.kr/content/js/lazyUIT.min.js"></script>
<script>
	$(window).load(function() {
		Promise.all([lazyUIT.jsPromise("/Public/Scripts/lib/raphael-min.js"), lazyUIT.jsPromise("http://m.jobkorea.co.kr/include/js/recruit.analytics.js")]).then(function (values) {
			recruit_giRead.drawGenderChart();
			//console.log(values);
		});
	});
</script>
</body>
```
