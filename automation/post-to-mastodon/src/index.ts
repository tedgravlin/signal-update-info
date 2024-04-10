export interface Env {
	PlatformTags: KVNamespace;
}

export default {
	async scheduled(event: Event, env: Env, ctx: ExecutionContext) {
		// Example: https://community.signalusers.org/t/beta-feedback-for-the-upcoming-android-7-3-release/60021/
		const url = "https://community.signalusers.org/t/beta-feedback-for-the-upcoming-{platform}-{major}-{minor}-release.json";

		/**
		 * Gathers the response from the URL fetch to check if a beta thread exists.
		 *
		 * @param response - The response from the URL fetch
		 * @returns response.text()
		 * 
		 */
		async function gatherResponse(response: any) {
			const { headers } = response;
			const contentType = headers.get("content-type") || "";
			if (contentType.includes("application/json")) {
				return JSON.stringify(await response.json());
			}
			return response.text();
		}

		/**
		 * Modifies the beta thread URL to include the given 
		 * platform and major/minor versions and returns the result.
		 *
		 * @param platform - String that represents platform (i.e. "android", "ios", "desktop")
		 * @param major - String that represents a platform's major verison number (i.e. **7**.5)
		 * @param major - String that represents a platform's minor verison number (i.e. 7.**5**)
		 * @returns URL of the potential beta thread 
		 * 
		 */
		function getModifiedUrl(platform: string, major: string, minor: string) {
			let newUrl = url;
			newUrl = newUrl.replace('{platform}', platform);
			newUrl = newUrl.replace('{major}', major);
			newUrl = newUrl.replace('{minor}', minor);
			return newUrl;
		}

		/**
		 * Checks if a release beta thread exists based on fetching its potential URL.
		 *
		 * @param platform - String that represents platform (i.e. "android", "ios", "desktop")
		 * @param major - String that represents a platform's major verison number (i.e. **7**.5)
		 * @param major - String that represents a platform's minor verison number (i.e. 7.**5**)
		 * @returns Boolean for whether URL is valid, the URL that was tested, and (if true) the release notes.
		 * 
		 */
		async function checkIfReleaseExists(platform: string, major: string, minor: string) {
			// Get the url to check
			let urlToCheck = getModifiedUrl(platform, major, minor);

			// Fetch the URL and store the JSON result
			let response = await fetch(urlToCheck);
			let results = await gatherResponse(response);
			let json = JSON.parse(results);

			// The string that should match with the topic_slug
			let stringToMatch = `beta-feedback-for-the-upcoming-${platform}-${major}-${minor}-release`;

			// If the link goes to a community thread, the resulting JSON will have a post_stream key/value
			if (json.post_stream != undefined) {
				// Check if the link exists, and if it does then change the KV {platform}_MINOR variable to match
				if (json.post_stream.posts[0].topic_slug === stringToMatch) {
					// Get the release notes from the page
					let releaseNotes = json.post_stream.posts[0].cooked;

					return [true, urlToCheck, releaseNotes];
				}
			}

			// If it isn't valid return false
			return [false, urlToCheck, "No release notes for invalid release."];
		}

		/**
		 * Returns the formatted version of a given platform
		 *
		 * @param platform - String that represents platform (i.e. "android", "ios", "desktop")
		 * @returns Formatted version of the given platform name (i.e. "Android", "iOS", "Desktop")
		 * 
		 */
		function getFormattedPlatform(platform: string) {
			if (platform === 'android') return 'Android';
			if (platform === 'ios') return 'iOS';
			if (platform === 'desktop') return 'Desktop';
			return null;
		}

		/**
		 * Constructs a new release post and sends it to Mastodon.
		 *
		 * @param platform - String that represents platform (i.e. "android", "ios", "desktop")
		 * @param major - String that represents a platform's major verison number (i.e. **7**.5)
		 * @param major - String that represents a platform's minor verison number (i.e. 7.**5**)
		 * @param urlToCheck - The URL to the community beta thread
		 * @param releaseNotes - String that contains the unformatted release notes for the given release
		 * 
		 */
		async function postToMastodon(platform: string, major: string, minor: string, url: string, releaseNotes: string) {
			// Obtain Mastodon API key
			let authorization: any = await env.PlatformTags.get("MASTODON_API_KEY");

			// Create form for fetch body
			const form = new FormData();
			form.append('status', `🎉 There's a new beta version of Signal!\n\nSignal for ${getFormattedPlatform(platform)} v${major}.${minor}\n\nCheck out the Signal Community thread for more info: ${url.replace('.json', '')}\n\n#signal #signalapp #signalupdated`);
			form.append('visibility', 'direct');

			// Attempt to post to Mastodon
			let response: any = await fetch('https://mastodon.world/api/v1/statuses', {
				method: 'POST', headers: { 'Authorization': authorization }, body: form
			});

			// Store the response as a JSON result
			let jsonResult = await response.json();

			// If the post was successful
			if (response.ok) {
				console.log(`✅ [Mastodon Post Successful: ${response.statusText}]`);
				// Update the KV variables
				await env.PlatformTags.put(`${platform.toUpperCase()}_MAJOR`, major);
				await env.PlatformTags.put(`${platform.toUpperCase()}_MINOR`, minor);
				console.log(`📝 [Variables for ${platform} have been updated.]`);

				// Attempt to reply to the original post if there is more information
				await replyToMastodonPost(jsonResult.id, platform, major, minor, await getFormattedReleaseNotes(releaseNotes));
			}
			// If the post was unsuccessful
			else console.error(`🚫 [Mastodon Post Error: ${response.statusText}]`);
		}

		/**
		 * Constructs a release notes post and replies to the parent post.
		 *
		 * @param postId: String that represents the ID of the post that this new post needs to reply to.
		 * @param platform - String that represents platform (i.e. "android", "ios", "desktop")
		 * @param major - String that represents a platform's major verison number (i.e. **7**.5)
		 * @param major - String that represents a platform's minor verison number (i.e. 7.**5**)
		 * @param urlToCheck - The URL to the community beta thread
		 * @param releaseNotes - String that contains the unformatted release notes for the given release
		 * 
		 */
		async function replyToMastodonPost(postId: string, platform: string, major: string, minor: string, releaseNotes: string) {
			let replyIsSplit: boolean = false;
			let [firstPostNotes, secondPostNotes] = ["", ""];

			// Obtain Mastodon API key
			let authorization: any = await env.PlatformTags.get("MASTODON_API_KEY");

			// Create form for fetch body
			const form = new FormData();

			// If there are no release notes, don't post a reply
			if (releaseNotes === "") return;

			// If the release notes are more than 500 characters (the mastodon.world character limit), 
			// split them into multiple replies
			if (releaseNotes.length >= 493) {
				[firstPostNotes, secondPostNotes] = splitReleaseNotes(releaseNotes)
				releaseNotes = firstPostNotes;
				replyIsSplit = true;
			}

			// Append Mastodon API options
			form.append('in_reply_to_id', postId);
			form.append('status', `#Signal for ${getFormattedPlatform(platform)} v${major}.${minor} release notes:\n\n${releaseNotes}`);
			form.append('visibility', 'direct');

			// Attempt to post the reply to Mastodon
			let response: any = await fetch('https://mastodon.world/api/v1/statuses', {
				method: 'POST', headers: { 'Authorization': authorization }, body: form
			});

			// Store the response as a JSON result
			let jsonResult = await response.json();

			// If the post was successful
			if (response.ok) {
				console.log(`✅ [Mastodon Reply Successful: ${response.statusText}]`);
				// If the reply is split, then post the second half of the release notes too
				if (replyIsSplit) {
					await replyToMastodonPost(jsonResult.id, platform, major, minor, secondPostNotes);
				}
			}
			// If the post was unsuccessful
			else console.log(`🚫 [Mastodon Reply Error: ${response.statusText}]`);
		}

		/**
		 * Formats release notes to remove any unnecessary characters.
		 *
		 * @param releaseNotes - String that contains the unformatted release notes for the given release
		 * 
		 * @returns Formatted release notes as a string.
		 */
		async function getFormattedReleaseNotes(releaseNotes: string): Promise<string> {
			let listRegex = /<ul>[\s\S]*?<\/ul>/gm as RegExp;
			let starRegex = /[★|\*][\s\S]*?<\/p>/gm as RegExp;

			// This will format release notes that use <li> for bullet points
			let formattedReleaseNotes: string = releaseNotes.match(listRegex)?.toString() || "";
			formattedReleaseNotes = formattedReleaseNotes.replaceAll("<ul>", "").replaceAll("</ul>", "").replaceAll("</li>", "").replaceAll("<li>", "* ");

			// This will format release notes that use ★ or * for bullet points
			if (formattedReleaseNotes === "") {
				formattedReleaseNotes = releaseNotes.match(starRegex)?.toString() || "";
				formattedReleaseNotes = formattedReleaseNotes.replace("<br>", "").replace("</p>", "").replace("★", "* ");
			}

			// Return result
			return formattedReleaseNotes;
		}

		/**
		 * Splits release notes into two separate strings.
		 *
		 * @param releaseNotes - String that contains the unformatted release notes for the given release
		 * 
		 * @returns Two separate release note strings.
		 */
		function splitReleaseNotes(releaseNotes: string) {
			let charCount = releaseNotes.length;

			let firstPostNotes = `${releaseNotes.substring(0, charCount / 2)}...\n\n1/2`;
			let secondPostNotes = `...${releaseNotes.substring(charCount / 2, charCount)}\n\n2/2`;

			return [firstPostNotes, secondPostNotes];
		}

		const platforms = ["android", "ios", "desktop"];

		// Loop thru each platform (android, ios, desktop)
		for (let platform of platforms) {
			// Get major and minor versions for the current platform
			let currentMajor = await env.PlatformTags.get(`${platform.toUpperCase()}_MAJOR`) || "";
			let currentMinor = await env.PlatformTags.get(`${platform.toUpperCase()}_MINOR`) || "";

			// Increment minor version
			let nextMinor = (Number(currentMinor) + 1).toString();

			// Check if this minor incremented version exists
			let [releaseExists, url, releaseNotes] = await checkIfReleaseExists(platform, currentMajor, nextMinor) || "";

			if (await releaseExists) {
				console.log(`🔔 [NEW minor release at: ${url}]`);
				// Post to mastodon
				await postToMastodon(platform, currentMajor, nextMinor, url, releaseNotes);
			}
			else {
				console.log(`👎 [NO minor release at: ${url}]`);

				// Increment major version
				let nextMajor = (Number(currentMajor) + 1).toString();

				// Check if this major incremented version exists
				[releaseExists, url, releaseNotes] = await checkIfReleaseExists(platform, nextMajor, '0') || "";

				if (await releaseExists) {
					console.log(`🔔 [NEW major release at: ${url}]`);
					// Post to mastodon
					await postToMastodon(platform, currentMajor, nextMinor, url, releaseNotes);
				}
				else console.log(`👎 [NO major release at: ${url}]`);
			}
		}
		return new Response('Signal Update Info - Post to Mastodon automation.');
	},
};


