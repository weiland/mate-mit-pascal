<script lang="ts">
	import LogoutButton from "./LogoutButton.svelte";
</script>

<footer class="footer">
	<a href="/" aria-label="Go to startpage" target="_blank">🧉 (home)</a>
	| created by
	<a href="https://chaos.social/@pascal" rel="noopener" target="_blank"
		>@pascal@chaos.social</a
	>
	| code @
	<a
		href="https://github.com/weiland/mate-mit-pascal/"
		rel="noreferrer noopener"
		target="_blank">github.com/mate-mit-pascal</a
	>
	| Club-Mate Trademark by
	<a
		href="https://www.club-mate.de/"
		rel="noreferrer noopener"
		target="_blank">club-mate.de</a
	>
	| Font:
	<a
		href="https://webfonts.ffonts.net/African.font"
		rel="noreferrer noopener"
		target="_blank">FFonts African Font</a
	>
	<LogoutButton />
</footer>

<style>
	.footer {
		line-height: 3;
	}
</style>
