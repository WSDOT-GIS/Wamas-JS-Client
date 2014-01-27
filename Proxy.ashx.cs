using System;
using System.Net;
using System.Text.RegularExpressions;
using System.Web;

namespace WamasJS
{
	/// <summary>
	/// Summary description for proxy
	/// </summary>
	public class Proxy : IHttpHandler
	{
		static readonly Regex allowedRe = new Regex(@"^(\w+\.)?geoservicestest\.wa\.gov$", RegexOptions.IgnoreCase | RegexOptions.ExplicitCapture);

		public void ProcessRequest(HttpContext context)
		{
			if (context.Request.UrlReferrer == null)
			{
				context.Response.ContentType = "text/plain";
				context.Response.StatusCode = 403;
				context.Response.Write("No Referrer is present.");
				return;

			}
			else if (string.Compare(context.Request.UrlReferrer.Host, context.Request.Url.Host, true) != 0)
			{
				context.Response.ContentType = "text/plain";
				context.Response.StatusCode = 403;
				context.Response.Write("The specified host is not permitted by this proxy.");
				return;
			}

			// Get the URL from the query string.
			var url = context.Request.Url.Query.TrimStart('?');
			if (Uri.IsWellFormedUriString(url, UriKind.Absolute))
			{
				var uri = new Uri(url);

				if (!allowedRe.IsMatch(uri.Host))
				{
					context.Response.ContentType = "text/plain";
					context.Response.StatusCode = 403;
					context.Response.Write("The specified host is not permitted by this proxy.");
					return;
				}

				var req = (HttpWebRequest)HttpWebRequest.Create(uri);

				CopyHeaders(context.Request, req);

				HttpWebResponse resp;

				try
				{
					resp = (HttpWebResponse)req.GetResponse();
					context.Response.Cache.SetMaxAge(TimeSpan.Zero);
				}
				catch (WebException ex)
				{
					// Some status codes (e.g., 304/Redirect) cause an exception.
					// Set the response to the exception's response object.
					resp = (HttpWebResponse)ex.Response;
				}

				context.Response.ContentType = resp.ContentType;
				context.Response.StatusCode = (int)resp.StatusCode;

				if (resp.Headers["Etag"] != null)
				{
					context.Response.AppendHeader("Etag", resp.Headers["Etag"]);
				}



				using (var stream = resp.GetResponseStream())
				{
					stream.CopyTo(context.Response.OutputStream);
				}
			}
			else
			{
				context.Response.StatusCode = 400;
				context.Response.ContentType = "text/plain";
				context.Response.Write("No URI was specified for the proxy.");
				return;
			}
		}

		/// <summary>
		/// Copies the headers from an <see cref="HttpRequest"/> to a <see cref="WebRequest"/>.
		/// </summary>
		/// <param name="source"></param>
		/// <param name="destination"></param>
		/// <param name="ignorePattern">
		/// <see cref="Regex"/> pattern that specifies which headers to NOT copy over.
		/// </param>
		private static void CopyHeaders(HttpRequest source, HttpWebRequest destination, string ignorePattern = @"(?in)^(User-Agent)$")
		{
			Regex specialRegex = new Regex(@"(?in)^((Accept)|(Host)|(Connection)|(Referer))$");
			Regex ignoreRegex = string.IsNullOrWhiteSpace(ignorePattern) ? null : new Regex(ignorePattern);
			destination.Accept = string.Join(",", source.AcceptTypes);
			foreach (string key in source.Headers.Keys)
			{
				if (specialRegex.IsMatch(key) || (ignoreRegex != null && ignoreRegex.IsMatch(key)))
				{
					continue;
				}

				destination.Headers.Add(key, source.Headers[key]);

			}
		}

		public bool IsReusable
		{
			get
			{
				return true;
			}
		}
	}
}